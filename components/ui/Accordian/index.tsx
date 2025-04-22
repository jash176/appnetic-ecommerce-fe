import AccordionContainer from './AccordionContainer';
import AccordionItem from './AccordionItem';

// Create a compound component structure
const Accordion = Object.assign(AccordionContainer, {
  Item: AccordionItem,
});

export default Accordion;