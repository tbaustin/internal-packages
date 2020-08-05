import React, { useState } from 'react'
import { Link } from 'gatsby'
import { css } from '@emotion/core'

export default function InfiniteNav({ links }){

	function Links(props) {
		const { link } = props
		const { title, subLinks, path } = link
    
		return (
			<li className={`navItem`}>
				<Link to={path} >
					{title}
				</Link>
				{subLinks && <ul className={`navLinks`}>
					{subLinks.map((slink, i) => <Links key={i} link={slink} />)}
				</ul>}
			</li>
		)
	}

	return (
		<nav css={styles}>
			<ul className="mainNav">
				{links.map((link, i) => <Links key={i} link={link} />)}
			</ul>
		</nav>
	)
}

const styles = css`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .mainNav, .navLinks {
    display: flex;
    flex-flow: row wrap;
  }
  .navItem {
    flex: 1 0 100%;
    position: relative;
  }
  .navLinks {
    position: absolute;
    top: 20px;
    left: 80px;
    width: 100%;
  }

`