import { Checkbox, Select as AntSelect } from 'antd';
import React, { useState } from 'react';

const MultiSelect = ({ skills, selectedSkills, onChange }) => {
  const handleSkillChange = (checked, skillId) => {
    if (checked) {
      // Add skill to selectedSkills
      onChange([...selectedSkills, skillId]);
    } else {
      // Remove skill from selectedSkills
      onChange(selectedSkills.filter(id => id !== skillId));
    }
  };

  return (
    <AntSelect
      mode="multiple"
      value={selectedSkills}
      placeholder="Chọn kỹ năng"
      style={{ width: '100%', maxWidth: '300px', textAlign: 'left', backgroundColor: 'transparent' }}
      onChange={onChange}
      allowClear
      dropdownStyle={{ color: 'hsl(0 0% 45.1%)' }}
      className="custom-select"
    >
      {skills.map((skill) => (
        <AntSelect.Option key={skill.id} value={skill.id}>
          <Checkbox
            checked={selectedSkills.includes(skill.id)}
            onChange={(e) => handleSkillChange(e.target.checked, skill.id)}
          >
            {skill.name}
          </Checkbox>
        </AntSelect.Option>
      ))}
    </AntSelect>
  );
};

// Add CSS for placeholder color
const style = document.createElement('style');
style.innerHTML = `
  .custom-select .ant-select-selection-placeholder {
    color: hsl(0 0% 45.1%) !important;
  }
`;
document.head.appendChild(style);

export default MultiSelect;
