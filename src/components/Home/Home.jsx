import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "../Navbar";
import { useToast } from "@chakra-ui/react";
import { Api } from "../../Api";
import { GlobalContext } from "../GlobalContext";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const toast = useToast();
  const generateToast = {
    title: "Link created.",
    description: "We've created your bundle Link for you.",
    status: "success",
    duration: 2000,
    isClosable: true,
  };
  const navigate = useNavigate();
  const [context, setContext] = useState("");
  useEffect(() => {
    var login = localStorage.getItem("login");
    if (login) {
      setContext(JSON.parse(login));
      console.log(login);
    }
  }, []);

  const { id } = context;

  const [RouteResult, setRouteResult] = useState("");

  async function HandleGenerateLink(e) {
    e.preventDefault();
    if (id) {
      try {
        const response = await fetch(`${Api}/create-route`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: id,
            userRouteName: e.target.username.value,
            name: e.target.name.value,
            about: e.target.about.value,
          }),
        });

        const result = await response.json();
        setRouteResult(result);
      } catch (error) {
        console.error("Error creating route:", error);
      }
    } else {
      navigate("/Login");
    }
  }

  return (
    <div>
      <Navbar />
      <section className="px-[5%] md:px-[15%] mt-[10vh]">
        <h1 className="md:text-6xl text-4xl font-semibold">
          All you'r Link in <br /> one place
        </h1>
        <p className="py-6 text-slate-500 md:text-lg">
          Gather all your online presence in one stunning page. Your story, your
          links, all in one place. Share the best version of you!
        </p>
        <div>
          <form
            className="flex flex-col md:max-w-xl gap-4 p-2 shadow-md"
            onSubmit={HandleGenerateLink}
          >
            <div className="flex">
              <div className="py-3 w-fit pl-3 hidden md:block text-sm md:text-md bg-white">
                Bundlelinker.com/
              </div>
              <input
                type="text"
                required
                placeholder="Route Name"
                name="username"
                className="py-3 px-3 w-full text-sm md:text-md text-blue-800 border-none outline-none bg-white"
              />
            </div>
            <input
              type="text"
              name="name"
              required
              placeholder="Name"
              className="py-3 px-3 w-full text-sm md:text-md  border-none outline-none bg-white"
            />
            <input
              type="text"
              name="about"
              required
              placeholder="About..."
              className="py-3 px-3 w-full text-sm md:text-md  border-none outline-none bg-white"
            />
            <button className="bg-blue-700 px-2 py-4 md:px-5 text-sm md:text-md text-white">
              Create Link
            </button>
          </form>
          <div>
            {!RouteResult.userRouteName ? (
              <p className="text-sm text-red-600">{RouteResult}</p>
            ) : (
              <p className="text-sm text-green-600">{`Your route created https://combiner.netlify.app/${RouteResult.userRouteName}`}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
