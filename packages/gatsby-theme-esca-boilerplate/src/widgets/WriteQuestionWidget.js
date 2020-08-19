import React, { useState } from 'react'
import { css } from '@emotion/core'
import { FaWindowClose } from 'react-icons/fa'
import axios from 'axios'
import { powerReviews } from 'config'

import Modal from '../components/modal'
import TextArea from '../components/power-review-inputs/TextArea'
import TextBox from '../components/power-review-inputs/TextBox'

import { colors } from '../styles/variables'

const { merchantId /*, apiKey*/ } = powerReviews

function ModalContent(props) {
	const { qType, setError, setSuccess } = props
	const [activeCat, setActiveCat] = useState(null)
	
	const [form, setForm] = useState({})

	const categories = [
		{ title: `Compatibility`, value: `compatibility` },
		{ title: `Specifications`, value: `specs` },
		{ title: `Product Quality`, value: `quality` },
		{ title: `Materials`, value: `materials` },
		{ title: `Instructions and Installation`, value: `instructions_installation` },
		{ title: `Usage`, value: `usage` },
	]

	if(!qType) {
		return null
	}

	const submitQuestion = async (e) => {
		e.preventDefault()
		const baseUrl = `https://writeservices.powerreviews.com/qa/question`
		const params = `?page_id=B8400W&locale=en_US&merchant_id=${merchantId}`

		const options = {
			question_type: `product`,
			merchant_question_category: `1:${activeCat?.value}`,
		}

		const { data } = await axios({
			method: `POST`,
			url: `${baseUrl}${params}`,
			data: {
				...form,
				...options,
			},
		})

		const status = data?.status_code

		if(status === 200) {
			setSuccess(true)
		} else {
			setError(`Something went wrong please try again.`)
		}
	}

	if(qType === `product`) {
		return (
			<form onSubmit={submitQuestion}>
				<div className="field">
					<label className="fieldLabel">
				Choose one
					</label>
					<div className="questionCategories">
						{categories.map((cat, i) => (
							<div 
								onClick={() => setActiveCat(cat)} 
								key={i}
								className={`questionCat ${activeCat?.value === cat?.value && `activeCat`}`}
							>{cat?.title}</div>
						))}
					</div>
				</div>
				<div className="field">
					<label className="fieldLabel">
					Question:<span className={`required`}>*</span>
					</label>
					<TextArea
						onChange={(value) => setForm({...form, question_text: value})}
					/>
				</div>
				<div className="field">
					<label className="fieldLabel">
					Email:<span className={`required`}>*</span>
					</label>
					<TextBox
						type="email"
						field={{ helper_text: `Ex. nancy@yahoo.com`}}
						onChange={(value) => setForm({...form, author_email: value})}
					/>
				</div>
				<div className="field">
					<label className="fieldLabel">
					Nickname:<span className={`required`}>*</span>
					</label>
					<TextBox
						field={{ helper_text: `Ex. Nancy the Newbie`}}
						onChange={(value) => setForm({...form, author_name: value})}
					/>
				</div>
				<div className="field">
					<label className="fieldLabel">
					Location:
					</label>
					<TextBox
						field={{ helper_text: `Ex. Barstow, CA`}}
						onChange={(value) => setForm({...form, author_location: value})}
					/>
				</div>

				<button type="submit" className="submitQuestion">
            Submit
				</button>
			</form>
		)
	} else {
		return (
			<div className={`inquiry`}>
				<p>
					Thanks for your inquiry!
				</p>
				<p>
					For questions about existing orders, please email or call our{` `}
					<a 
						target="_blank"
						rel="noopener noreferrer"
						href="https://support.escaladesports.com/support/home"
					>
						customer service representatives
					</a>.
				</p>
			</div>
		)
	}
}

export default function WriteQuestionWidget(props){
	const [active, setActive] = useState(false)
	const [qType, setQType] = useState(null)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState(null)

	return (
		<div css={styles}>
			<button className={`btn`} onClick={() => setActive(true)}>
				Ask a Question
			</button>
			<Modal active={active}>
				<div className="modalWrapper">
					<div className="close">
						<FaWindowClose onClick={() => setActive(false)}/>
					</div>
					{error && (
						<div className="error">
							{error}
						</div>
					)}
					{success && (
						<div className="success">
							Successfully submitted question! Please allow a couple of business days for submission!
						</div>
					)}
					{!success && (
						<>
							<div className="field">
								<label className="fieldLabel">
									Type of question:<span className={`required`}>*</span>
								</label>
								<div className="questionType">
									<div 
										className={`type ${qType === `service` && `activeType`}`} 
										onClick={() => setQType(`service`)}
									>
										The Service
									</div>
									<div 
										className={`type ${qType === `product` && `activeType`}`} 
										onClick={() => setQType(`product`)}
									>
										The Product
									</div>
								</div>
							</div>

							<ModalContent 
								setSuccess={setSuccess}
								setError={setError}
								qType={qType} 
							/>
						</>
					)}
				</div>
			</Modal>
		</div>
	)
}

const styles = css`
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
	.questionCategories {
		.questionCat {
			border: 1px solid #ccc;
			border-bottom: none;
    	padding: 10px;
			cursor: pointer;
			:hover {
				background: ${colors.lightGrey};
			}
			:last-of-type {
				border-bottom: 1px solid #ccc;
			}
		}
		.activeCat {
			background: ${colors.red};
			color: #fff;
			border: none;
			box-shadow: none;
			:hover {
				background: ${colors.red};
			}
		}
	}
	.submitQuestion {
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
	.questionType {
		display: flex;
		.type {
			flex: 1 0 50%;
			border: 1px solid ${colors.grey};
			box-shadow: 0px 1px 1px #ccc;
			padding: 10px;
			text-align: center;
			cursor: pointer;
			:hover {
				background: ${colors.lightGrey};
			}
			:last-of-type {
				border-left: none;
			}
		}
		.activeType {
			background: ${colors.red};
			color: #fff;
			border: none;
			box-shadow: none;
			:hover {
				background: ${colors.red};
			}
		}
	}
	.btn {
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
	.modalWrapper {
    background: #fff;
    height: 100%;
    overflow: auto;
    padding: 30px;
    width: 100%;
    max-width: 400px;
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
  .required {
		color: red;
	}
	.inquiry {
		border: 1px solid ${colors.lightGrey};
		padding: 20px;
		a {
			color: ${colors.red};
		}
	}
`