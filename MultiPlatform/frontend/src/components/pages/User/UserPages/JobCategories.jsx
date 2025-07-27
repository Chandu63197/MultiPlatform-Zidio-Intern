import React from "react";
import "./userpage.css"; // Optional: for external styling

const categories = [
  "Software Development",
  "Design",
  "Marketing",
  "Sales",
  "Customer Support",
  "Finance",
  "Human Resources",
  "Product Management",
  "Data Science",
  "Operations",
];

const JobCategories = ({ onCategoryClick }) => {
  return (
    <div className="job-categories-container">
      <h3>Explore Job Categories</h3>
      <div className="category-list">
        {categories.map((category, index) => (
          <button
            key={index}
            className="category-button"
            onClick={() => onCategoryClick?.(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobCategories;
