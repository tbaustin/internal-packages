import React, { useState } from 'react'
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
import loadQuestions from '../utils/reviews/load-questions'
import usePromise from '../hooks/usePromise'

import { colors, breakpoints } from '../styles/variables'

const { merchantId } = powerReviews

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
	const [offset, setOffset] = useState(0)
	const [votes, setVotes] = useState({})
	const [sortedQuestions, setSortedQuestions] = useState(null)
  
	const [data, error, pending] = usePromise(loadQuestions, {})
	const { allQuestions: questions, paging } = data

	const pageSize = paging?.page_size
	const pageCount = paging?.pages_total

	if(pending) {
		return <div>Loading...</div>
	}

	if(error) {
		console.log(`Error: `, error)
		return <div>Error fetching reviews...</div>
	}

	if(!questions || !questions.length) {
		return null
	}
  
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
		let newSort = []

		switch(e.target.value){
			case `oldest`: 
				newSort = sortArr(questions, `desc`, `details.created_date`)
				break
			case `newest`: 
				newSort = sortArr(questions, `asc`, `details.created_date`)
				break
			case `mostAnswers`:
				newSort = sortArr(questions, `asc`, `answer.length`)
				break
			default: 
				break
		}

		if(newSort.length) setSortedQuestions(newSort)
	}
  
	const handlePaginate = data => {
		const { selected } = data
		setOffset(Math.ceil(selected * pageSize))
	}

	const slicedQuestions = (sortedQuestions || questions).slice(offset, pageSize + offset)

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