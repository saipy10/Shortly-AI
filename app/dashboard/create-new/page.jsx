'use client'
import React from "react";
import SelectTopic from "./_components/SelectTopic";

function CreateNew() {
  const [formData, setFormData] = useState([]);

  const onHandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);
  };

  return (
    <div className="md:px-20">
      <h2 className="font-bold text-4xl text-primary text-center">CreateNew</h2>
      <div className="mt-10 shadow-md p-10">
        {/* Select Topic  */}
        <SelectTopic onUserSelect={onHandleInputChange} />
        {/* Select Style  */}

        {/* Duration  */}

        {/* Create Button  */}
      </div>
    </div>
  );
}

export default CreateNew;
