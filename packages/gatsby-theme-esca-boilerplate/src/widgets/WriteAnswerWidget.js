import React, { useState } from 'react'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { css } from '@emotion/core'
import { FaWindowClose } from 'react-icons/fa'
import axios from 'axios'
import { powerReviews } from 'config'

import Modal from '../components/modal'
import TextArea from '../components/power-review-inputs/TextArea'
import TextBox from '../components/power-review-inputs/TextBox'

import { colors } from '../styles/variables'

const { merchantId /*, apiKey*/ } = powerReviews

export default function WriteAnswerWidget(props){
	const { question } = props
	const { question_id } = question

	const [active, setActive] = useState(false)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState(null)
	const [form, setForm] = useState({})

	const submitAnswer = async (e) => {
		e.preventDefault()
		const baseUrl = `https://writeservices.powerreviews.com/qa/answer`
		const params = `?page_id=B5402W&locale=en_US&question_id=${question_id}&merchant_id=${merchantId}`
	
		const { data } = await axios({
			method: `POST`,
			url: `${baseUrl}${params}`,
			data: {
				...form,
				question_id,
			},
		})

		const status = data?.status_code

		if(status === 200) {
			setSuccess(true)
		} else {
			setError(`Something went wrong please try again.`)
		}
	}

	return (
		<div css={styles}>
			<div className="addAnswer" onClick={() => setActive(true)}>
				<IoIosAddCircleOutline /> Add your answer
			</div>
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
							Successfully submitted answer! Please allow a couple of business days for submission!
						</div>
					)}
					{!success && (
						<form onSubmit={submitAnswer}>
							<div className="field">
								<label className="fieldLabel">
									Answer:<span className={`required`}>*</span>
								</label>
								<TextArea 
									onChange={(value) => setForm({...form, answer_text: value})}
								/>
							</div>

							<div className="field">
								<label className="fieldLabel">
									Nickname:
								</label>
								<TextBox
									field={{ helper_text: `Ex. Nancy the Newbie`}}
									onChange={(value) => setForm({...form, author_name: value})}
								/>
							</div>

							<div className="field">
								<label className="fieldLabel">
            Your Location:
								</label>
								<TextBox 
									field={{ helper_text: `Ex. Barstow, CA`}}
									onChange={(value) => setForm({...form, author_location: value})}
								/>
							</div>

							<button type="submit" className="submitAnswer">
            Submit
							</button>
						</form>
					)}
				</div>
			</Modal>
		</div>
	)
}

const styles = css`
  .submitAnswer {
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
  .addAnswer {
    color: ${colors.red};
    cursor: pointer;
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
`