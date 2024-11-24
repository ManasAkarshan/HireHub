"use client";
import ProtectedRoute from "@/components/protected-route";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import MyEditor from "./_components/editor";
import { BeatLoader } from "react-spinners";

const ResumeChecker = () => {
  const editorRef = useRef();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inp, setInp] = useState("");
  const [data, setData] = useState(null);
  async function generateContent() {
    if (file) {
      setLoading(true);
      const res = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API}`,
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `Just assume i have uploaded a resume (which i have obviously not so just assume) and generate me few points to add and improve(just assume any resume) for my resume for domain ${inp} note: I am telling you to assume but while generating answer you will act like your have some original resume`,
                },
              ],
            },
          ],
        },
      });
      setData(res["data"]["candidates"][0]["content"]["parts"][0]["text"]);
      setLoading(false);
    }
    else{
      window.alert("Upload resume")
    }
  }

  function handleValueChange(e) {
    setInp(e.target.value);
    console.log(inp);
  }

  return (
    <ProtectedRoute>
      <div className="w-3/4 mx-auto">
        <h1 className="text-4xl mb-10">Upload your resume</h1>
        <div className="w-full items-center gap-1.5 mx-auto">
          <Label htmlFor="picture">Resume</Label>
          <Input id="picture" type="file" className="mb-6" onChange={(e)=>setFile(e.target.files[0])}/>
          <Input
            type="text"
            placeholder="Enter domain"
            className="mb-6"
            onChange={handleValueChange}
          />
          <Button onClick={generateContent}>
            {loading ? (
              <BeatLoader size={10} color="green" />
            ) : (
              "Generate recommendations"
            )}
          </Button>
        </div>

        <div className="mt-4">
          <MyEditor data={data} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ResumeChecker;
