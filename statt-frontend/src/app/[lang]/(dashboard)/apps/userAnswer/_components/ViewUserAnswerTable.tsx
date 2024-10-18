"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import TablePagination from "@mui/material/TablePagination";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import IconButton from "@mui/material/IconButton";
import {
  UserAnswerType as ImportedUserAnswerType,
  SectionType,
  QuestionType,
  AnswerType,
  UserAnswerType,
} from "@/types/apps/userTypes";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

interface UserAnswerTypeLocal {
  section: SectionType;
  questions: QuestionType[];
}

interface ViewAnswerTableProps {
  userId: string | null;
}

const ViewAnswerTable: React.FC<ViewAnswerTableProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswerTypeLocal[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (userId) {
      fetchUserAnswers();
      fetchUserName();
    }
  }, [userId]);

  const fetchUserAnswers = async () => {
    try {
      const response = await axios.get<ImportedUserAnswerType[]>(
        `http://localhost:3001/user-answers/user/${userId}`
      );

      const transformedAnswers: UserAnswerTypeLocal[] = response.data.reduce(
        (acc: UserAnswerTypeLocal[], answer) => {
          const sectionId = answer.question.section.id;
          const sectionTitle = answer.question.section.title;

          const existingSection = acc.find(
            (sec) => sec.section.id === sectionId
          );

          // Determine the correct answer for the question
          const correctAnswer = answer.question.options.find(
            (option) => option.isCorrect
          )?.text;

          // Determine if the user's answer is correct
          const isUserAnswerCorrect = answer.isCorrect;

          // Create the userAnswer object
          const userAnswer: UserAnswerType = {
            correctAnswers: isUserAnswerCorrect ? 1 : 0,
            wrongAnswers: isUserAnswerCorrect ? 0 : 1,
            answerText: Array.isArray(answer.answerText)
              ? answer.answerText
              : [answer.answerText], // Ensure answerText is an array
            isCorrect: isUserAnswerCorrect,
            question: answer.question,
            section: answer.section,
            user: answer.user,
            id: answer.id,
            name: answer.name,
            email: answer.email,
            correctAnswer: correctAnswer || "", // Set correct answer
          };

          if (existingSection) {
            // Ensure userAnswer is treated as an array
            existingSection.questions.push({
              ...answer.question,
              options: answer.question.options || [],
              userAnswer: [
                ...(existingSection.questions[0]?.userAnswer || []),
                userAnswer,
              ], // Add the userAnswer to the array
            });
          } else {
            acc.push({
              section: { id: sectionId, title: sectionTitle },
              questions: [
                {
                  ...answer.question,
                  options: answer.question.options || [],
                  userAnswer: [userAnswer],
                },
              ],
            });
          }

          return acc;
        },
        []
      );

      setUserAnswers(transformedAnswers);
    } catch (err) {
      console.error("Error fetching user answers:", err);
      setError("Failed to fetch user answers");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserName = async () => {
    try {
      const response = await axios.get<{ name: string }>(
        `http://localhost:3001/user/${userId}`
      );
      setUserName(response.data.name); // Set the user's name in the state
    } catch (err) {
      console.error("Error fetching user name:", err);
      setError("Failed to fetch user name");
    }
  };

  const handleToggle = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId], // Toggle the specific section's expanded state
    }));
  };

  if (loading) return <Typography>Loading answers...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  // Calculate the current page's answers
  const currentAnswers = userAnswers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Card>
      <CardHeader title={`User ${userName}'s Answers`} className='pbe-4' />
      <Divider />
      <div className='flex justify-end gap-4 p-5 flex-col items-start sm:flex-row sm:items-center'>
          <Button variant='contained' onClick={() => router.back()} className='is-full sm:is-auto'>
            Back
          </Button>
        </div>
        <Divider />
      <div className="overflow-x-auto">
        {currentAnswers.map((answer) => {
          const { section, questions } = answer;
          const isExpanded = expandedSections[section.id] || false;

          return (
            <Accordion
              expanded={isExpanded}
              onChange={() => handleToggle(section.id.toString())}
              key={section.id}
            >
              <AccordionSummary>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" style={{ flexGrow: 1 }}>
                    {section.title}
                  </Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                {questions.map((question: QuestionType) => {
                  console.log("Question:", question); // Log question to check its structure
                  const userAnswer =
                    question.userAnswer && question.userAnswer.length > 0
                      ? question.userAnswer[0]
                      : null;
                  const isUserAnswerCorrect = userAnswer?.isCorrect;

                  return (
                    <div key={question.id} className="my-2">
                      <Typography variant="body1" className="font-bold">
                        {question.question} {/* Display the question text */}
                      </Typography>
                      {/* Render options if they exist */}
                      {Array.isArray(question.options) &&
                      question.options.length > 0 ? (
                        <div className="options-container grid gap-2">
                          {question.options.map((option: AnswerType) => {
                            // Check if the user selected this option
                            const isUserSelected =
                              userAnswer &&
                              userAnswer.answerText.includes(option.text);
                            const isCorrect = option.isCorrect; // Check if the option is correct

                            // Determine the border and text color
                            const borderColor = isCorrect
                              ? "border-green-500"
                              : isUserSelected
                                ? "border-red-500"
                                : "border-gray-300";
                            const textColor = isCorrect
                              ? "text-green-700"
                              : isUserSelected
                                ? "text-red-700"
                                : "border-gray-700";

                            return (
                              <div
                                key={option.id}
                                className={`p-2 border ${borderColor} rounded-md mb-2`}
                              >
                                <Typography className={textColor}>
                                  {option.text} {isCorrect && "(Correct)"}
                                </Typography>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <Typography>
                          No options available for this question.
                        </Typography>
                      )}
                       {/* Render user answers for the question  */}
                      <div className="border p-2 mt-2 rounded-md">
                        {(() => {
                          try {
                            // Check if userAnswer exists and is valid
                            if (userAnswer && typeof userAnswer === "object") {
                              // Check if answerText is an array
                              if (Array.isArray(userAnswer.answerText)) {
                                // Check if there are answers provided by the user
                                if (userAnswer.answerText.length > 0) {
                                  return (
                                    <>
                                      <Typography>
                                        User Answer:{" "}
                                        <span
                                          className={`font-bold ${
                                            userAnswer.isCorrect
                                              ? "text-green-700"
                                              : "text-red-700"
                                          }`}
                                        >
                                          {userAnswer.answerText.join(", ")}
                                        </span>
                                      </Typography>
                                      {!userAnswer.isCorrect && (
                                        <Typography>
                                          Correct Answer:{" "}
                                          <span className="font-bold text-green-700">
                                            {
                                              question.options.find(
                                                (option) => option.isCorrect
                                              )?.text
                                            }
                                          </span>
                                        </Typography>
                                      )}
                                    </>
                                  );
                                } else {
                                  return (
                                    <Typography>No answer provided.</Typography>
                                  );
                                }
                              } else {
                                return (
                                  <Typography>
                                    Error: answerText should be an array.
                                  </Typography>
                                );
                              }
                            } else {
                              return (
                                <Typography>
                                  Error: Invalid user answer format.
                                </Typography>
                              );
                            }
                          } catch (error) {
                            // Handle unexpected errors
                            console.error(
                              "Error rendering user answer:",
                              error
                            );
                            return (
                              <Typography>
                                Error rendering answer. Please try again later.
                              </Typography>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={userAnswers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
};

export default ViewAnswerTable;
