import React, { useContext, useEffect, useRef, useState } from "react";
import { Navbar } from "../Navbar";
import { FaClipboard } from "react-icons/fa";
import { GlobalContext } from "../GlobalContext";
import { Api } from "../../Api";
import { CiCirclePlus } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { Spinner, useToast } from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CiTrash } from "react-icons/ci";
export const Dashboard = () => {
  const toast = useToast();

  const [isCopied, setIsCopied] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [allLinks, setAllLinks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [inputFields, setInputFields] = useState([
    [
      <input
        required
        className="border px-1 outline-none py-2 w-full rounded-sm"
        placeholder="Title"
      />,
      <input
        type="url"
        required
        className="border px-1 text-blue-700 outline-none  py-2 w-full rounded-sm"
        placeholder="Link"
      />,
    ],
  ]);
  const [ImageLoading, setImageLoading] = useState(false);

  const [updateInput, setUpdateInput] = useState({ title: "", url: "" });
  const navigate = useNavigate();

  const formRef = useRef();

  const updateRef = useRef();

  const handleCopyClick = () => {
    const linkText = "https://combiner.netlify.app/" + routeName.userRouteName;
    const tempInput = document.createElement("input");
    document.body.appendChild(tempInput);
    tempInput.value = linkText;
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  const [context, setContext] = useState("");
  useEffect(() => {
    var login = localStorage.getItem("login");
    if (login) {
      setContext(JSON.parse(login));
      console.log(login);
    }
  }, []);

  const { id } = context;
  async function GetRoute() {
    if (id) {
      let response = await fetch(`${Api}/get-route/${id}/0`);
      let data = await response.json();
      setRouteName(data);
      console.log(data);
    }
  }
  async function GetLinks() {
    console.log(routeName);
    if (id) {
      let response = await fetch(`${Api}/get-links?RouteId=${routeName._id}`);
      let data = await response.json();
      setAllLinks(data);
    }
  }

  useEffect(() => {
    GetRoute();
  }, [context, refresh]);

  useEffect(() => {
    GetLinks();
  }, [routeName, refresh]);

  async function HandleFormSubmit(e) {
    e.preventDefault();
    let i = 0;
    let arr = [];
    while (formRef.current[i] != undefined) {
      if (formRef.current[i].tagName.toLowerCase() === "input") {
        arr.push({
          title: formRef.current[i].value,
          link: formRef.current[i + 1].value,
        });
      }
      i += 2;
    }

    if (routeName._id) {
      const registrationToast = toast({
        title: "Adding Links",
        status: "loading",
      });
      try {
        const response = await fetch(`${Api}/create-links`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            RouteId: routeName._id,
            userRouteName: routeName.userRouteName,
            linksArray: arr,
          }),
        });

        const result = await response.json();
        toast.close(registrationToast);
        toast({
          title: "links Created",
          description: "Links Added successful",
          status: "success",
          duration: 1000,
        });
      } catch (error) {
        toast.close(registrationToast);
        toast({
          title: "Error",
          description: "Duplicate Title",
          status: "error",
          duration: 500,
          colorScheme: "red",
        });
      } finally {
        setRefresh(!refresh);
      }
    }
  }

  return (
    <div>
      <Navbar />
      {routeName ? (
        <div className="px-[5%] md:px-[15%]">
          <div>
            <div className="my-[5vh] bg-white flex flex-col ">
              <div
                onClick={handleCopyClick}
                className="flex cursor-pointer justify-between bg-slate-800 p-2 text-white"
              >
                <p>Your Routing Link</p>
                <p className="flex gap-2 items-center">
                  <FaClipboard />
                  <p>{isCopied ? "Copied" : "Copy"}</p>
                </p>
              </div>
              <a
                className="text-center text-blue-700 p-2"
                href={"https://combiner.netlify.app/" + routeName.userRouteName}
              >
                https://combiner.netlify.app/{routeName.userRouteName}
              </a>
            </div>
            <div className="w-full bg-white p-4 flex flex-col gap-4">
              <h1 className="text-2xl sm:text-3xl">Create New Links</h1>
              <form
                onSubmit={HandleFormSubmit}
                ref={formRef}
                className="flex flex-col gap-4"
              >
                {inputFields.map((input, i) => (
                  <div key={i}>
                    <div className="flex gap-4 flex-col sm:flex-row bg-slate-100 rounded-sm shadow-md p-2">
                      {input}
                    </div>
                  </div>
                ))}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setInputFields((inputFields) => {
                      let arr = [...inputFields];
                      arr.push([
                        <input
                          required
                          className="border px-1 outline-none py-2 w-full rounded-sm"
                          placeholder="Title"
                        />,
                        <input
                          type="url"
                          required
                          className="border px-1 text-blue-700 outline-none  py-2 w-full rounded-sm"
                          placeholder="Link"
                        />,
                      ]);
                      return arr;
                    });
                  }}
                  className="self-end  bg-emerald-800 p-4 flex justify-center items-center rounded-full text-white"
                >
                  <FaPlus />
                </button>

                <button
                  type="submit"
                  className="text-white bg-blue-700 py-2 px-3 rounded-md"
                >
                  Submit
                </button>
              </form>
              <div>
                <h1 className="text-2xl sm:text-3xl py-4">Profile</h1>
                {routeName.profile != "" ? (
                  <div className="w-[100px] h-[100px] rounded-full border-4 mx-auto">
                    <img
                      src={routeName.profile}
                      className="w-full h-full object-cover rounded-full border-4 border-black"
                    />
                  </div>
                ) : (
                  <div className="w-full">
                    <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                      <span className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="font-medium text-gray-600">
                          Drop files to Attach, or
                          <span className="text-blue-600 underline">
                            browse
                          </span>
                        </span>
                      </span>
                      <input
                        type="file"
                        name="file_upload"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];

                          const fileNameSpan =
                            document.querySelector(".file-label-text");
                          fileNameSpan.textContent = file.name;

                          // Make API call
                          const apiUrl =
                            "https://image-service-hcni.onrender.com/upload/single";
                          const formData = new FormData();
                          formData.append("image", file);

                          try {
                            setImageLoading(true);
                            const response = await fetch(apiUrl, {
                              method: "POST",
                              body: formData,
                            });

                            if (response.ok) {
                              const result = await response.text();
                              console.log(result);
                              try {
                                const response = await fetch(
                                  `${Api}/update-profile`,
                                  {
                                    method: "PUT",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      RouteId: routeName._id,
                                      profile: result,
                                    }),
                                  }
                                );

                                const res = await res.text();
                                toast({
                                  title: res,
                                  duration: 1000,
                                  colorScheme: "green",
                                });
                                console.log(res);
                                setRefresh(!refresh);
                              } catch (error) {
                                console.log(res);
                                setRefresh(!refresh);
                              } finally {
                                setRefresh(!refresh);
                              }
                            } else {
                              console.error(
                                "Failed to make API call:",
                                response.status
                              );
                            }
                          } catch (error) {
                            console.error("Error making API call:", error);
                          } finally {
                            setImageLoading(false);
                          }
                        }}
                      />
                    </label>
                    <span className="file-label-text font-medium text-gray-600"></span>
                    <div>
                      {ImageLoading && (
                        <>
                          <Spinner />
                          Processing
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl">Update Links</h1>
              {updateInput.title != "" && (
                <form
                  ref={updateRef}
                  onSubmit={async (e) => {
                    e.preventDefault();

                    try {
                      setUpdateLoading(true);
                      const response = await fetch(`${Api}/update-link`, {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          RouteId: routeName._id,
                          title: updateInput.title,
                          updatedTitle: updateRef.current.title.value,
                          updatedLink: updateRef.current.url.value,
                        }),
                      });

                      const result = await response.text();
                      console.log(result);
                    } catch (error) {
                      console.log(error);
                      setUpdateLoading(false);
                    } finally {
                      setUpdateLoading(false);
                      setRefresh(!refresh);
                      setUpdateInput({ title: "", url: "" });
                    }
                  }}
                  className={
                    updateInput.title && updateInput.url
                      ? "flex gap-2 flex-col sm:flex-row bg-slate-100 rounded-sm shadow-md p-2"
                      : ""
                  }
                >
                  <input
                    required
                    name="title"
                    className="border px-1 outline-none py-2 w-full rounded-sm"
                    placeholder="Title"
                    defaultValue={updateInput.title}
                  />
                  <input
                    type="url"
                    required
                    name="url"
                    className="border px-1 text-blue-700 outline-none py-2 w-full rounded-sm"
                    placeholder="Link"
                    defaultValue={updateInput.url}
                  />
                  {updateInput.title && updateInput.url && (
                    <button
                      type="submit"
                      className="text-white bg-yellow-600 py-2 px-3 rounded-md"
                    >
                      {updateLoading ? <Spinner /> : "Update"}
                    </button>
                  )}
                </form>
              )}

              <div className="flex flex-col gap-4">
                {allLinks.map((links, i) => {
                  return links.linksArray.map((link, j) => (
                    <div
                      key={j}
                      className="flex flex-wrap  items-center gap-2 bg-emerald-50 p-2 shadow-md  w-full "
                    >
                      <div className="flex justify-between items-center w-full ">
                        <p className="truncate">{link.title}</p>
                        <div className="flex items-center justify-center gap-1">
                          <div
                            onClick={() => {
                              console.log(link);
                              console.log(link);
                              setUpdateInput({
                                title: link.title,
                                url: link.link,
                              });
                            }}
                            className="cursor-pointer bg-amber-600 text-white p-1 rounded-full"
                          >
                            <MdEdit size={18} />
                          </div>
                          <div
                            onClick={async () => {
                              try {
                                setUpdateLoading(true);
                                const response = await fetch(
                                  `${Api}/delete-link`,
                                  {
                                    method: "DELETE",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      RouteId: routeName._id,
                                      title: link.title,
                                    }),
                                  }
                                );

                                const result = await response.text();
                                toast({
                                  title: result,
                                  duration: 1000,
                                });
                              } catch (error) {
                                console.log(error);
                              } finally {
                                setUpdateLoading(false);
                                setRefresh(!refresh);
                              }
                            }}
                            className="cursor-pointer bg-red-600 text-white p-1 rounded-full"
                          >
                            <CiTrash size={18} />
                          </div>
                        </div>{" "}
                      </div>
                      <p className="text-sm md:text-lg font-medium truncate">
                        {link.link}
                      </p>
                    </div>
                  ));
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="text-center text-2xl py-8">No Route You Created </h1>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white text-center text-md mx-auto py-3 px-2 rounded-lg"
          >
            Press To Create Route
          </button>
        </div>
      )}
    </div>
  );
};
