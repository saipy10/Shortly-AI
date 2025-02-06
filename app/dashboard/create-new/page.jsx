"use client";
import React, { useEffect, useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "@/components/ui/button";
import axios from "axios";
import CustomLoading from "./_components/CustomLoading";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { VideoData } from "@/configs/schema";
import PlayerDialog from "../_components/PlayerDialog";

function CreateNew() {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();
  const [imageList, setImageList] = useState();
  const [playVideo, setPlayVideo] = useState();
  const [videoId, setVideoId] = useState();
 
  const { videoData, setVideoData } = useContext(VideoDataContext);
  const { user } = useUser();

  const onHandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onCreateClickHandler = () => {
    GetVideoScript();
    // GenerateAudioFile(scriptData);
    // GenerateAudioCaption(FILEURL);
    // GenerateImage();
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

    const resp = await axios.post("/api/get-video-script", {
      prompt: prompt,
    });
    if (resp.data.result) {
      setVideoData((prev) => ({
        ...prev,
        videoScript: resp.data.result,
      }));
      console.log(resp.data.result);
      setVideoScript(resp.data.result);
      await GenerateAudioFile(resp.data.result);
    }
  };

  // Generate Audio File and save to firebase storage
  const GenerateAudioFile = async (videoScriptData) => {
    let script = "";
    const id = uuidv4();
    videoScriptData.forEach((item) => {
      script = script + item.ContentText + " ";
    });

    const resp = await axios.post("/api/generate-audio", {
      text: videoScriptData,
      id: id,
    });
    setVideoData((prev) => ({
      ...prev,
      audioFileUrl: resp.data.result,
    }));
    setAudioFileUrl(resp.data.result);

    resp.data.result &&
      (await GenerateAudioCaption(resp.data.result, videoScriptData));
  };

  // Used to generate caption from audio file
  const GenerateAudioCaption = async (fileUrl, videoScriptData) => {
    setLoading(true);
    const resp = await axios.post("/api/generate-caption", {
      audioFileUrl: fileUrl,
    });
    setCaptions(resp?.data?.result);
    setVideoData((prev) => ({
      ...prev,
      captions: resp.data.result,
    }));
    resp.data.result && GenerateImage(videoScriptData);
  };

  // Generate AI images
  const GenerateImage = async (videoScriptData) => {
    setLoading(true);
    let images = [];

    for (const element of videoScriptData) {
      try {
        const resp = await axios.post("/api/generate-image", {
          prompt: element?.imagePrompt,
        });

        console.log("Generated Image:", resp.data.imageUrl);
        images.push(resp.data.imageUrl);
      } catch (error) {
        console.error(
          "Error generating image:",
          error.response?.data || error.message
        );
      }
    }
    setVideoData((prev) => ({
      ...prev,
      imageList: images,
    }));

    console.log("All generated images:", images);
    setImageList(images);
    setLoading(false);
    console.log(images, videoScript, audioFileUrl, captions);
  };
  useEffect(() => {
    console.log(videoData);
    if (Object.keys(videoData).length === 4) {
      SaveVideoData(videoData);
    }
  }, [videoData]);

  const SaveVideoData = async (videoData) => {
    setLoading(true);

    const result = await db
      .insert()
      .values({
        script: videoData?.videoScript,
        audioFileUrl: videoData?.audioFileUrl,
        captions: videoData?.captions,
        imageList: videoData?.imageList,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      })
      .returning({ id: VideoData?.id });
    setVideoId(result[0].id);
    setPlayVideo(true);
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
      <PlayerDialog playVideo={playVideo} videoId={videoId} />
    </div>
  );
}

export default CreateNew;
