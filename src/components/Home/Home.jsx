import React, { useContext, useState } from "react";
import { Navbar } from "../Navbar";
import { useToast } from "@chakra-ui/react";
import { Api } from "../../Api";
import { GlobalContext } from "../GlobalContext";

export const Home = () => {
  const toast = useToast();
  const generateToast = {
    title: "Link created.",
    description: "We've created your bundle Link for you.",
    status: "success",
    duration: 2000,
    isClosable: true,
  };

  const context = useContext(GlobalContext);
  const { id } = context.LoginAuth;

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
          }),
        });

        const result = await response.json();
        setRouteResult(result);
      } catch (error) {
        console.error("Error creating route:", error);
      }
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
          Make you'r link today and share more
        </p>
        <div>
          <form
            className="inline-flex  shadow-md"
            onSubmit={HandleGenerateLink}
          >
            <div className="flex">
              <div className="py-3 pl-3 hidden md:block text-sm md:text-md bg-white">
                Bundle-linker.com/
              </div>
              <input
                type="text"
                required
                placeholder="Username"
                name="username"
                className="py-3 px-3  text-sm md:text-md text-blue-800 border-none outline-none bg-white"
              />
            </div>
            <button className="bg-blue-700 px-2 md:px-5 text-sm md:text-md text-white">
              Create Link
            </button>
          </form>
          <div>
            {!RouteResult.userRouteName ? (
              <p className="text-sm text-red-600">{RouteResult}</p>
              ) : (
                <p className="text-sm text-green-600">{`Your route created http://127.0.0.1:5173/${RouteResult.userRouteName}`}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
