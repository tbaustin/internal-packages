import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { css } from '@emotion/core'
import get from 'lodash/get'
import { MdKeyboardArrowLeft,  MdKeyboardArrowRight } from 'react-icons/md'
import { FaThumbsDown, FaThumbsUp} from 'react-icons/fa'
import { format } from 'date-fns'
import ReactPaginate from 'react-paginate'
import { powerReviews } from 'config'

import WriteQuestionWidget from './WriteQuestionWidget'
import WriteAnswerWidget from './WriteAnswerWidget'

import { colors, breakpoints } from '../styles/variables'

const { merchantId, apiKey } = powerReviews

const sortArr = (arr, dir, val) => {
	return [...arr].sort((a, b) => {
		const aVal = get(a, val)
		const bVal = get(b, val)
		if(dir === `asc`) {
			return (bVal===null)-(aVal===null) || +(bVal>aVal) || -(bVal<aVal)
		} else {
			return (aVal===null)-(bVal===null) || +(aVal>bVal) || -(aVal<bVal)
		}
	})
}

export default function QuestionDisplayWidget(props){
	
	const [isLoading, setLoading] = useState(false)
	const [questions, setQuestions] = useState(null)
	const [pageCount, setPageCount] = useState(null)
	const [pageSize, setPageSize] = useState(null)
	const [offset, setOffset] = useState(0)
	const [votes, setVotes] = useState({})
  
	useEffect(() => {
		const baseUrl = `https://readservices-b2c.powerreviews.com`
		const defaultUrl = `${baseUrl}/m/${merchantId}/l/en_US/product/B5402W/questions?apikey=${apiKey}`
		setLoading(true)
		let storedQuestions = []
		let init = false 
		
		const loadReviews = async (url) => {
			const { data } = await axios.get(url || defaultUrl)
			const results = data?.results
			const paging = data?.paging
			const {  
				page_size,
				pages_total, 
				next_page_url, 
				current_page_number, 
			} = paging || {}
			
			if(results){
				storedQuestions = [...storedQuestions, ...results]
			}

			if(!init){
				setPageSize(page_size || 10)
				setPageCount(pages_total || 10)
				init = true
			}			

			if(current_page_number < pages_total) {
				await loadReviews(`${baseUrl}${next_page_url}&apikey=${apiKey}`)
			} else {
				setQuestions(storedQuestions)
				setLoading(false)
			}
		}

		loadReviews()
	}, [])
  
	const handleVote = async (vote, ugcId) => {
		const voteUrl = `https://writeservices.powerreviews.com/voteugc`

		const { data } = await axios({
			method: `POST`,
			url: voteUrl,
			data: {
				merchant_id: merchantId,
				vote_type: vote,
				ugc_id: ugcId,
			},
		})
		if(data?.status_code === 200){
			setVotes({ [ugcId]: vote })
		}
	}

	const handleSort = e => {
		let sortedQuestions = []

		switch(e.target.value){
			case `oldest`: 
				sortedQuestions = sortArr(questions, `desc`, `details.created_date`)
				break
			case `newest`: 
				sortedQuestions = sortArr(questions, `asc`, `details.created_date`)
				break
			case `mostAnswers`:
				sortedQuestions = sortArr(questions, `asc`, `answer.length`)
				break
			default: 
				break
		}

		if(sortedQuestions.length) setQuestions(sortedQuestions)
	}
  
	const handlePaginate = data => {
		const { selected } = data
		setOffset(Math.ceil(selected * pageSize))
	}
  
	if(isLoading) {
		return <div>Loading...</div>
	}
	
	if(!questions || !questions.length) {
		return null
	}

	const slicedQuestions = questions.slice(offset, pageSize + offset)

	return (
		<div css={styles}>
			<section className="headline">
				<div className="title">Q&A</div>
				<WriteQuestionWidget />
			</section>

			{/* ---- */}
			{/* Sort starts here */}
			{/* ---- */}

			<div className="sort">
				<div className="showing">Showing {slicedQuestions.length} out of {questions.length} Questions</div>
				<select onChange={handleSort} className="prSort" name="prSort" id="prSort">
					<option value="newest">Most Recent</option>
					<option value="oldest">Oldest</option>
					<option value="mostAnswers">Most Answers</option>
				</select>
			</div>

			<section className="questionList">
				{slicedQuestions.map((question, i) => {

					const { details, answer: answers } = question
					const { text, nickname, created_date } = details

					return (
						<div key={i} className="questionItem">
							<div className="questionAuthor desktop">Asked by {nickname} {format(new Date(created_date), `MM/dd/yyyy`)}</div>
							<div className="questionContent">
								<div className="question"><div className="qIcon">Q</div> <p>{text}</p></div>
								<div className="answerContent">
									<div className="questionAuthor mobile">Asked by {nickname} {format(new Date(created_date), `MM/dd/yyyy`)}</div>
									<WriteAnswerWidget question={question} />
									{answers && !!answers.length && (
										<ul className="answerList">
											{answers.map((answer, j) => {
												const { metrics, details: aDetails, ugc_id } = answer
												const { nickname: aNickname, is_expert, text: aText } = aDetails
												const { helpful_votes, not_helpful_votes } = metrics
												const userVote = votes[ugc_id] === `helpful` ? 1 : votes[ugc_id] === `unhelpful` ? -1 : 0
                    
												return (
													<li key={j} className="answerItem">
														<div className="answerAuthor">{is_expert ? `Verified Reply - ` : ``}{aNickname}</div>
														<div className="answer">{aText}</div>
														<div className="votes">
															<div className={`icon thumbup ${votes[ugc_id] === `helpful` ? `selectedVote` : ``} ${votes[ugc_id] ? `voted`: ``}`}>
																<FaThumbsUp onClick={() => {
																	if(!votes[ugc_id]){
																		handleVote(`helpful`, ugc_id)
																	}
																}} /> {helpful_votes + userVote}
															</div>
															<div className={`icon thumbdown ${votes[ugc_id] === `unhelpful` ? `selectedVote` : ``} ${votes[ugc_id] ? `voted`: ``}`}>
																<FaThumbsDown onClick={() => {
																	if(!votes[ugc_id]){
																		handleVote(`unhelpful`, ugc_id)
																	}
																}} /> {not_helpful_votes + userVote}
															</div>
														</div>
													</li>
												)
											})}
										</ul>
									)}
								</div>
							</div>
						</div>
					)
				})}
			</section>

			{/* ---- */}
			{/* Pagination starts here */}
			{/* ---- */}

			<div className="paginate">
				<ReactPaginate
					previousLabel={<MdKeyboardArrowLeft />}
					nextLabel={<MdKeyboardArrowRight />}
					breakLabel={`...`}
					pageCount={pageCount}
					marginPagesDisplayed={2}
					pageRangeDisplayed={3}
					onPageChange={handlePaginate}
					containerClassName={`pagination`}
					subContainerClassName={`pages pagination`}
					activeClassName={`active`}
				/>
			</div>
		</div>
	)
}

const styles = css`
	ul {
		list-style: none;
    margin: 0;
    padding: 0;
		width: 100%;
	}
	.sort {
		margin-bottom: 40px;
		text-align: right;
		display: flex;
    justify-content: space-between;
		.prSort {
			outline: 0;
			padding: 5px 10px 5px 5px;
			border-radius: 0px;
			display: inline-block;
			min-width: 150px;
			width: auto;
			margin: 0 0 0 10px;
			cursor: pointer;
		}
	}
	.desktop {
		display: none;
	}
	.questionAuthor {
		margin-right: 40px;
		color: ${colors.textMedium};
		font-size: 12px;
		flex-basis: 12%;
	}
	.headline {
		display: flex;
		margin-bottom: 40px;
		justify-content: space-between;
    padding: 0 40px;
		.title {
			font-size: 40px;
		}
	}
	.questionItem {
		display: flex;
	}
	.answerContent {
		margin-left: 40px;
	}
	.answerItem {
		border-left: 2px solid ${colors.red};
		padding-left: 20px;
		flex: 1;
	}
	.questionContent, .answerContent, .answerItem {
		display: flex;
		flex-flow: column nowrap;
		flex: 1;
		> div {
			margin-bottom: 15px;
		}
	}
	.answerList {
		list-style: none;
		margin: 0;
		padding: 0;
		width: 100%;
	}
	.voted {
		cursor: not-allowed;
	}
	.selectedVote {
		svg {
			opacity: .85;
			fill: ${colors.red};
			:hover {
				fill: ${colors.red};
			}
		}
	}
	.votes {
		display: flex;
		align-items: center;
		> div {
			margin-right: 15px;
		}
	}
	.icon {
		display: flex;
		align-items: center;
		cursor: pointer; 
		svg {
			height: 24px;
			width: 24px;
			margin-right: 10px;
			fill: ${colors.grey};
			:hover {
				fill: ${colors.darkGrey};
			}
		}
	}
  .question {
    display: flex;
    align-items: center;
		p {
			margin: 0;
		}
  }
  .qIcon {
    background: ${colors.red};
    color: #fff;
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-radius: 50%;
    margin-right: 15px;
  }
  .pagination {
		margin: 40px 0;
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		> .active {
			background: ${colors.red};
			a {
				color: ${colors.white};
			}
		}
		> li {
			padding: 5px 10px;
			font-size: 16px;
			cursor: pointer;
			margin-bottom: 0;
			font-size: 22px;
			svg {
				height: 22px;
				width: 22px;
			}
			a {
				color: ${colors.red};
				outline: none;
				border: none;
			}
			:first-of-type {
				margin-right: 20px;
				border-radius: 2px;
			}
			:last-of-type {
				margin-left: 20px;
				border-radius: 2px;
			}
		}
	}
	@media(${breakpoints.laptop}){
		.desktop {
			display: block;
		}
		.mobile {
			display: none;
		}
	}
`