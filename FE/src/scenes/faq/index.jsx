import { Box } from "@mui/material";
import { useState } from "react";
import { Header, AccordionItem } from "../../components";
import { mockAccordionData } from "../../data/mockData";

const FAQ = () => {
  // Primi 3 aperti: 0, 1, 2
  const [expandedIndexes, setExpandedIndexes] = useState([0, 1, 2]);

  const handleChange = (index) => {
    setExpandedIndexes(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // chiudi se già aperto
          : [...prev, index] // apri
    );
  };

  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />
      {mockAccordionData.map((accordion, index) => (
        <AccordionItem
          key={index}
          {...accordion}
          expanded={expandedIndexes.includes(index)}
          onChange={() => handleChange(index)}
        />
      ))}
    </Box>
  );
};

export default FAQ;
