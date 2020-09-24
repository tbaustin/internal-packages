import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { css } from '@emotion/core'
import loadable from '@loadable/component'
import { FaWindowClose } from 'react-icons/fa'

import { powerReviews } from 'config'
import { colors } from '../styles/variables'
import usePromise from '../hooks/usePromise'

function DefaultInput(props) {
	return (
		<input type="text" {...props}/>
	)
}

const AsyncInput = loadable(props => import(`../components/power-review-inputs/${props.type || `File`}`), {
  cacheKey: props => props.type,
})

const isEmpty = (val) => {
	// checks for empty objects, arrays, strings, undefined, null values
	if(typeof val === 'object' && val !== null){
		let isEmpty = true
		for(let key in val) {
			if(val.hasOwnProperty(key)) isEmpty = false
		}
		return isEmpty
	} else if((val !== 0 && !val) || (isNaN(val) && !val.length)) {
		return true
	} else {
		return false
	}
}


export default function WriteReviewWidget(props){
	const { sku } = props
	if(!sku || !sku.length) {
		return <div>Loading...</div>
	}

	const { merchantId, writeApiKey } = powerReviews
	const [active, setActive] = useState(false)
	const [mediaData, setMedia] = useState({})
	const [errors, setErrors] = useState(null)
	const [reviewStatus, setStatus] = useState(null)
	const [fieldData, setFieldData] = useState({})



	const baseUrl = `https://writeservices.powerreviews.com/api/b2b/writereview/review_template`
	const params = `?apikey=${writeApiKey}&merchant_id=${merchantId}&page_id=${sku.toUpperCase()}`
	const url = `${baseUrl}${params}`

	const loadReview = async () => await axios.get(url)

	const [response, error, pending] = usePromise(loadReview, {})

	const { data } = response

	const fields = data?.fields

	useEffect(() => {
		setFieldData(fields?.reduce((acc, cur) => {
			return { ...acc, [cur.key]: cur }
		}, {}))
	}, [fields])

	if(pending){
		return <div>Loading...</div>
	}

	if(error) {
		console.log(`Error: `, error)
		return <div>Error fetching review...</div>
	}

	function renderField(field, idx){
		const { 
			key, 
			label, 
			input_type,
			prompt,
			composite_type,
			required,
		} = field

		return (
			<div className="field" key={`${idx}-${key}`}>
				<label className="fieldLabel" htmlFor={key}>
					{label || prompt}
					{required && <span className={`required`}>*</span>}
				</label>
				<AsyncInput 
					type={input_type}
					field={field}
					onChange={(value, isMedia) => {
						if (isMedia) {
							// video or image
							setMedia({ ...mediaData, [composite_type]: value })
						} else { 
							setFieldData({ ...fieldData, [key]: { ...field, value } })
						}
					}}
				/>
			</div>
		)
	}

	async function submitReview(e) {
		e.preventDefault()

		const errs = []
		const fieldsWithValue = []

		Object.values(fieldData).forEach(field => {
			if(field.required && isEmpty(field.value)){
				errs.push(`"${field.label || field.prompt}" is required`)
			} 
			if (!isEmpty(field.value)) {
				fieldsWithValue.push(field)
			}
		})

		Object.values(mediaData).forEach(mediaArr => {
			mediaArr.forEach(media => {
				fieldsWithValue.push(media)

				media.fields?.forEach(f => {
					if(f.required && isEmpty(f.value)){
						errs.push(`"${f.label || f.prompt}" is required`)
					}
				})
			})
		})

		if(errs.length){
			setErrors(errs)
		} else {
			setErrors(null)
			const submitUrl = `https://writeservices.powerreviews.com/war/writereview?merchant_id=${merchantId}&page_id=${`B8400W`}&is_complete=true&locale=en_US`

			const { data } = await axios({
				method: `POST`,
				url: submitUrl,
				data: {
					fields: fieldsWithValue
				},
			})
			if(data?.status_code === 200){
				setStatus(200)
			} else {
				setStatus(400)
			}
		}
	}

	return (
		<div css={styles}>
			<button className={`writeReviewBtn`} onClick={() => setActive(true)}>Write a Review</button>
			<div className={`modal ${active ? `activeModal` : ``}`}>
				<div className="modalWrapper">
					<div className="close">
						<FaWindowClose onClick={() => setActive(false)}/>
					</div>
					{reviewStatus === 200 ? (
						<div className={`smallModal`}>Review Submission Successful!!</div>
					) : !fields 
						? <div className={`smallModal`}>Loading Form...</div>
						: (
							<form onSubmit={submitReview}>
								<h2>
							Write Review Form
								</h2>
								<div className="fieldList">
									{fields?.map?.((field, i) => renderField(field, i))}
								</div>
								{errors && (
									<ul className="errors">
										{errors.map((err, i) => (
											<li key={i}>{err}</li>
										))}
									</ul>
								)}
								{!!reviewStatus && reviewStatus !== 200 && (
									<div className={`submitError`}>Something went wrong with the submission, please try again.</div>
								)}
								<button type="submit" className={`submitReview`}>Submit Review</button>
							</form>
						)}
				</div>
			</div>
		</div>
	)
}


const styles = css`
	.writeReviewBtn {
		border: 0;
    outline: 0;
    color: #fff;
    font-size: 20px;
    padding: 5px 15px;
    background: ${colors.red};
    cursor: pointer;
		margin: 10px 0;
	}
	.submitError {
		color: red;
		margin: 10px 0;
	}
	.errors {
		display: flex;
		flex-flow: column nowrap;
		color: red;
		list-style: none;
    margin: 20px;
    padding: 0px;
		> li {
			margin: 10px 0;
		}
	}
  .required {
		color: red;
	}
	.submitReview {
		color: ${colors.white};
		background: ${colors.red};
		border: none;
		outline: none;
		cursor: pointer;
		font-size: 18px;
		padding: 8px 16px;
		:hover {
			opacity: .85;
		}
	}
  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background: rgba(0, 0, 0, .5);
    justify-content: center;
		align-items: flex-start;
    z-index: 2000;
		padding: 50px;
		.modalWrapper {
			background: #fff;
			height: 100%;
			overflow: auto;
		}
		.smallModal {
			background: #fff;
			height: 400px;
			padding: 20px;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30px;
		}
    form {
      background: #fff;
			padding: 20px;
			text-align: center;
    }
		.close {
			padding: 10px;
			display: flex;
			justify-content: flex-end;
			svg {
				fill: ${colors.red};
				cursor: pointer;
				height: 25px;
				width: 25px;
			}
		}
  }
	.activeModal {
		display: flex;
	}
	.field {
		display: flex;
		flex-flow: column nowrap;
		margin: 30px 0;
	}
	.fieldLabel {
		font-size: 20px;
		margin-bottom: 10px;		
	}
`