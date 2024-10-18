"use client";

import { Typography } from "@mui/material";
import { useParams } from "next/navigation";
import React from "react";
import ViewAnswerTable from "../_components/ViewUserAnswerTable";

const UserPage = () => {
  const params = useParams();
  let userId: string | null = null;

  // Handle string or string[] case
  if (Array.isArray(params?.coId)) {
    userId = params.coId[0]; // Take the first value if it's an array
  } else {
    userId = params?.coId ?? null; // Default to null if it's undefined
  }

  // Log to debug
  console.log("Params:", params);
  console.log("User ID:", userId);

  return (
    <div>
      {userId ? (
        <>
          <ViewAnswerTable userId={userId} />
        </>
      ) : (
        <Typography variant="h4">Loading...</Typography>
      )}
    </div>
  );
};

export default UserPage;
