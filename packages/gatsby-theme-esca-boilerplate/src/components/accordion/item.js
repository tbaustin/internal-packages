import React from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import {
	AccordionItem as Item,
	AccordionItemHeading as ItemHeading,
	AccordionItemButton as ItemButton,
	AccordionItemPanel as ItemPanel
} from 'react-accessible-accordion'


export default function AccordionItem(props) {
  const { id, heading, children, active } = props
  
  return (
    <Item uuid={id}>
      <ItemHeading>
        <ItemButton>
					{heading || null}
          <span className="plusIcon">
            {active ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </span>
        </ItemButton>
      </ItemHeading>
      <ItemPanel>
        {children}
      </ItemPanel>
    </Item>
  )
}
