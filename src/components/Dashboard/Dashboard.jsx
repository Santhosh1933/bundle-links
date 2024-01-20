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
  const context = useContext(GlobalContext);

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

  const [updateInput, setUpdateInput] = useState({ title: "", url: "" });
  const navigate = useNavigate();

  const formRef = useRef();

  const updateRef = useRef();

  const handleCopyClick = () => {
    const linkText = "http://127.0.0.1:5173/santhosh";
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

  const { id } = context.LoginAuth;
  async function GetRoute() {
    if (id) {
      let response = await fetch(`${Api}/get-route?userId=${id}`);
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
          duration:500
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
            <div
              onClick={handleCopyClick}
              className="w-full md:w-2/4 bg-green-300 transition-all mx-auto py-4 px-2 text-center my-[5vh] rounded-md border-2 border-green-800 cursor-pointer"
            >
              <p className="text-end font-semibold animate-pulse">
                {isCopied && <i>!Copied</i>}
              </p>
              <a href={"http://127.0.0.1:5173/" + routeName.userRouteName}>
                http://127.0.0.1:5173/{routeName.userRouteName}
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
                {/* <button
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
                </button> */}

                <button
                  type="submit"
                  className="text-white bg-blue-700 py-2 px-3 rounded-md"
                >
                  Submit
                </button>
              </form>
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
                                  duration:1000,
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
