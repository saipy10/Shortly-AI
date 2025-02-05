"use client";
import React, { useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "@/components/ui/button";
import axios from "axios";
import CustomLoading from "./_components/CustomLoading";
import { v4 as uuidv4 } from "uuid";

const scriptData = "Hello everyone I am here";
const FILEURL =
  "https://firebasestorage.googleapis.com/v0/b/unite-b2c55.firebasestorage.app/o/Shorts-AI%2Ff8b3a65d-6006-43dc-86c4-d344f460b192.mp3?alt=media&token=b816b564-2719-4a08-a096-55d4c915b2be";
function CreateNew() {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();

  const onHandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onCreateClickHandler = () => {
    // GetVideoScript();
    // GenerateAudioFile(scriptData);
    GenerateAudioCaption(FILEURL);
  };

  // Get Video Script
  const GetVideoScript = async () => {
    setLoading(true);
    const prompt =
      "Write a script to generate " +
      formData.duration +
      " video on topic: " +
      formData.topic +
      " along with AI image prompt in " +
      formData.imageStyle +
      " format for each scene and give me result in JSON format with imagePrompt and ContentText as field, No Plain text";
    console.log(prompt);

    const result = await axios
      .post("/api/get-video-script", {
        prompt: prompt,
      })
      .then((resp) => {
        console.log(resp.data.result);
        setVideoScript(resp.data.result);
        GenerateAudioFile(resp.data.result);
      });
    setLoading(false);
  };

  const GenerateAudioFile = async (videoScriptData) => {
    setLoading(true);
    let script = "";
    const id = uuidv4();
    // videoScriptData.forEach((item) => {
    //   script = script + item.ContentText + " ";
    // });
    await axios
      .post("/api/generate-audio", {
        text: videoScriptData,
        id: id,
      })
      .then((resp) => {
        setAudioFileUrl(resp.data.result);
      });
    setLoading(false);
  };

  const GenerateAudioCaption = async (fileUrl) => {
    setLoading(true);
    await axios
      .post("/api/generate-caption", {
        audioFileUrl: fileUrl,
      })
      .then((resp) => {
        console.log(resp.data.result);
        setCaptions(resp?.data?.result);
      });
    setLoading(false);
  };

  return (
    <div className="md:px-20">
      <h2 className="font-bold text-4xl text-primary text-center">CreateNew</h2>
      <div className="mt-10 shadow-md p-10">
        {/* Select Topic  */}
        <SelectTopic onUserSelect={onHandleInputChange} />
        {/* Select Style  */}
        <SelectStyle onUserSelect={onHandleInputChange} />
        {/* Duration  */}
        <SelectDuration onUserSelect={onHandleInputChange} />
        {/* Create Button  */}
        <Button onClick={onCreateClickHandler} className="mt-10 w-full">
          Create Short Video
        </Button>
      </div>
      <CustomLoading loading={loading} />
    </div>
  );
}

export default CreateNew;
