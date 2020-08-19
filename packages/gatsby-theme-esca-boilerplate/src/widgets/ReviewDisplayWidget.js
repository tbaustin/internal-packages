import React, { useEffect, useState } from 'react'
import axios from 'axios'
import get from 'lodash/get'
import { css } from '@emotion/core'
import { format } from 'date-fns'
import { FaThumbsDown, FaThumbsUp} from 'react-icons/fa'
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardArrowLeft,  MdKeyboardArrowRight} from 'react-icons/md'
import ReactPaginate from 'react-paginate'
import { powerReviews } from 'config'

import Stars from '../components/stars'
import WriteReviewWidget from './WriteReviewWidget'
import { colors, breakpoints, screenWidths } from '../styles/variables'

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

export default function ReviewDisplayWidget(props){
	const { sku } = props
	const { merchantId, apiKey } = powerReviews

	/*
		* Hooks start
	*/

	const [reviews, setReviews] = useState(null)
	const [reviewData, setReviewData] = useState(null)
	const [isLoading, setLoading] = useState(false)
	const [showProps, setProps] = useState({})
	const [votes, setVotes] = useState({})
	const [pageCount, setPageCount] = useState(null)
	const [pageSize, setPageSize] = useState(null)
	const [offset, setOffset] = useState(0)

	useEffect(() => {
		const baseUrl = `https://readservices-b2c.powerreviews.com`
		const defaultUrl = `${baseUrl}/m/${merchantId}/l/en_US/product/B8400W/reviews?apikey=${apiKey}`
		setLoading(true)
		let storedReviews = []
		let init = false 
		
		const loadReviews = async (url) => {
			const { data } = await axios.get(url || defaultUrl)
			const results = data?.results?.[0]
			const paging = data?.paging
			const {  
				page_size,
				pages_total, 
				next_page_url, 
				current_page_number, 
			} = paging || {}
			
			if(results?.reviews){
				storedReviews = [...storedReviews, ...results?.reviews]
			}

			if(!init){
				setPageSize(page_size || 10)
				setPageCount(pages_total || 10)
				setReviewData(results)
				init = true
			}			

			if(current_page_number < pages_total) {
				await loadReviews(`${baseUrl}${next_page_url}&apikey=${apiKey}`)
			} else {
				setReviews(storedReviews)
				setLoading(false)
			}
			
		}

		loadReviews()
	}, [])

	/*
	 * Functions start 
	*/

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

	const handlePaginate = data => {
		const { selected } = data
		setOffset(Math.ceil(selected * pageSize))
	}

	const handleSort = e => {
		let sortedReviews = []
		switch(e.target.value){
			case `oldest`: 
				sortedReviews = sortArr(reviews, `desc`, `details.created_date`)
				break
			case `newest`: 
				sortedReviews = sortArr(reviews, `asc`, `details.created_date`)
				break
			case `helpful`: 
				sortedReviews = sortArr(reviews, `asc`, `metrics.helpful_score`)
				break
			case `ratedAsc`: 
				sortedReviews = sortArr(reviews, `asc`, `metrics.rating`)
				break	
			case `ratedDesc`: 
				sortedReviews = sortArr(reviews, `desc`, `metrics.rating`)
				break
			default: 
				break
		}

		if(sortedReviews.length) setReviews(sortedReviews)
	}

	/*
	 * Vars start 
	*/
	const rollup = reviewData?.rollup
	const { 
		average_rating,
		review_count,
		rating_histogram,
		recommended_ratio,
	} = rollup || {}

	if(isLoading) {
		return <div>Loading...</div>
	}
	
	if(!reviews || !reviews.length) {
		return null
	}

	return (
		<div css={styles}>

			{/* ---- */}
			{/* Snapshot starts here */}
			{/* ---- */}

			{rollup && (
				<section className={`snapshot`}>
					<h2 className={`headline`}>Review Snapshot</h2>
					<div className="wrapper">
						<div className="rating">
							<div className="average">
								{average_rating}
							</div>
							<div className="stars">
								<Stars rating={average_rating} />
							</div>
							<div className="reviewCount">
								{review_count} reviews
							</div>
							<div className="writeReview">
								<WriteReviewWidget sku={sku}/>
							</div>
						</div>

						<div className="recommend">
							<div>
								<span className="percent">{recommended_ratio * 100}%</span>
							</div>
							<p>
								of users would recommend this to a friend
							</p>
						</div>
					
						<div className="histogram">
							<ul className="histoList">
								{rating_histogram?.map((total, i) => (
									<li className="histoItem" key={i}>
										<div className={`histoStarValue`}>{i + 1} Star(s)</div>
										<div className={`histoBar`}>
											<div className="histoFillBar" css={css`
												width: ${(total / review_count) * 100}%;
											`} />
										</div>
										<div className={`histoTotal`}>{total}</div>
									</li>
								))}
							</ul>
						</div>
					</div>
				</section>
			)}

			{/* ---- */}
			{/* Sort starts here */}
			{/* ---- */}

			<div className="sort">
				<select onChange={handleSort} className="prSort" name="prSort" id="prSort">
					<option value="newest">Most Recent</option>
					<option value="oldest">Oldest</option>
					<option value="helpful">Most Helpful</option>
					<option value="ratedAsc">Top Rated</option>
					<option value="ratedDesc">Lowest Rated</option>
				</select>
			</div>

			{/* ---- */}
			{/* Reviews Start Here */}
			{/* ---- */}

			<ul className={`reviewList`}>
				{reviews.slice(offset, pageSize + offset).map((review, i) => {
					const { details, metrics, ugc_id } = review
					const { 
						created_date, headline, comments, 
						nickname, location, properties,
						bottom_line,
					} = details
					const { rating, helpful_votes, not_helpful_votes } = metrics

					const userVote = votes[ugc_id] === `helpful` ? 1 : votes[ugc_id] === `unhelpful` ? -1 : 0

					return (
						<li key={i} className={`reviewItem`}>
							<div className="reviewItemHeader">
								<Stars rating={rating} />
								<h3>{headline}</h3>
							</div>
							<div className="reviewItemBody">
								<p className="comments">
									{comments}
								</p>
								<div className="details">
									<div className="submissionDate">
										<span className={`bold`}>Submitted</span> {format(new Date(created_date), `MM/dd/yyyy`)}
									</div>
									<div className="nickname">
										<span className={`bold`}>By</span> {nickname}
									</div>
									<div className="location">
										<span className={`bold`}>From</span> {location}
									</div>
								</div>
							</div>
							<div className="reviewItemProperties">
								{properties && (
									<>
										<div className="toggleProps" onClick={() => setProps({ [i]: !showProps[i] })}>
											{showProps[i] ? `Less Details` : `More Details`}
											{showProps[i] ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
										</div>
										{showProps[i] && <ul className="properties">
											{properties.map((prop, i) => {
												const { label, value } = prop
												return (
													<li className={`propItem`} key={i}>
														<div className={`propHeader`}><span className="bold">{label}</span></div>
														<ul className={`propList`}>
															{value?.map((val, i) => (
																<li key={i}>
																	{val}
																</li>
															))}
														</ul>
													</li>
												)
											})}
										</ul>}
									</>
								)}
							</div>
							<div className="reviewItemBottomLine">
								<span className="bold">Bottom Line</span> {bottom_line}, I would recommend to a friend
							</div>
							<div className="reviewItemHelpful">
								<div className="title">Was this review helpful to you?</div>
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
							</div>
						</li>
					)
				})}
			</ul>

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
	.sort {
		margin: 20px 40px;
		text-align: right;
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
			font-size: 18px;
			cursor: pointer;
			margin-bottom: 0;
			font-size: 28px;
			svg {
				height: 28px;
				width: 28px;
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
  width: 100%;
	h2.headline {
		font-size: 45px;
		font-weight: 700;
		border-bottom: 1px solid ${colors.grey};
		padding-bottom: 20px;
	}
	ul {
		list-style: none;
    margin: 0;
    padding: 0;
		width: 100%;
	}
	.histoBar {
		width: 250px;
		margin: 0 10px;
		height: 15px; 
		background: ${colors.backgroundGrey};
		border-radius: 11px;
	}
	.histoFillBar {
		height: 15px; 
		border-radius: 11px;
		background: ${colors.red};
	}
  .snapshot {
		border-bottom: 1px solid ${colors.grey};
		padding-bottom: 20px;
		.wrapper {
			max-width: ${screenWidths.laptop};
			margin: 0 auto;
			display: flex;
    	align-items: center;
			justify-content: space-between;
		}
		.recommend {
			text-align: center;
			font-size: 10px;
			color: ${colors.textMedium};
			.percent {
				background: ${colors.red};
				color: ${colors.white};
				padding: 5px 15px;
				font-size: 40px;
				margin-bottom: 10px;
			}
		}
    .rating {
      text-align: center;
      .average {
				font-size: 32px;
			}
    }
    .star {
      height: 25px;
      width: 25px;
			color: ${colors.red};
    }
		.reviewCount {
			font-size: 14px;
			color: ${colors.textDark};
		}
		.histogram {
			.histoItem {
				display: flex;
				cursor: pointer;
			}
			.histoList {
				display: flex;
				flex-flow: column-reverse nowrap;
			}
		}
  }
  .reviewList {
    display: flex;
    flex-flow: column nowrap;
    .starContainer {
      margin-right: 15px;
    }
		.star {
			color: ${colors.red};
		}
    .reviewItemHeader {
      display: flex;
      align-items: center;
    }
    .reviewItemBody {
			display: flex;
			flex-flow: row wrap;
			justify-content: space-between;
			color: ${colors.textMedium};
			font-size: 14px;
    }
  }
	.bold {
		color: ${colors.textDark};
		margin-right: 4px;
	}
	.reviewItemProperties {
		font-size: 14px;
		.propHeader {
			margin-bottom: 15px;
		}
		.propList {
			color: ${colors.textMedium};
		}
		.toggleProps {
			cursor: pointer;
			margin-bottom: 15px;
			display: flex;
			align-items: center;
			color: ${colors.red};
			svg {
				width: 15px;
				height: 15px;
			}
		}
		.properties {
			display: flex;
			flex-flow: row wrap;
			margin: -10px;
			.propItem {
				margin: 10px;
			}
		}
	}
	.reviewItemBottomLine {
		font-size: 14px;
		margin-bottom: 15px;
		color: ${colors.textMedium};
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
	.reviewItemHelpful {
		font-size: 14px;
		display: flex;
		align-items: center;
		> div {
			margin-right: 15px;
		}
		.votes {
			display: flex;
			align-items: center;
			> div {
				margin-right: 15px;
			}
		}
	}

	@media(${breakpoints.tablet}){
		.reviewList {
			.reviewItemBody {
				.comments {
					flex-basis: calc(75% - 20px);
				}
				.details {
					flex-basis: 25%;
				}
			}
		}
	}
`