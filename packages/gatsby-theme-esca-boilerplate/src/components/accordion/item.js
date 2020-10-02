import React from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import {
	AccordionItem as Item,
	AccordionItemHeading as ItemHeading,
	AccordionItemButton as ItemButton,
	AccordionItemState as ItemState,
	AccordionItemPanel as ItemPanel
} from 'react-accessible-accordion'


export default function AccordionItem(props) {
  const { id, heading, children, active } = props

  return (
    <Item uuid={id}>
      <ItemHeading>
        <ItemButton>
					{heading || null}
					<ItemState>
						{state => (
							<span className="plusIcon">
		            {state.expanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
		          </span>
						)}
					</ItemState>
        </ItemButton>
      </ItemHeading>
      <ItemPanel>
        {children}
      </ItemPanel>
    </Item>
  )
}
