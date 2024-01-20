import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Api } from "../../Api";

export const OutputPage = () => {
  const location = useLocation();
  const routeName = location.pathname.slice(1);
  const navigate = useNavigate();
  const [routeDetails, setRouteDetails] = useState();
  const [links, setLinks] = useState();

  const colors = [
    "#add8e6", // Light Blue
    "#90ee90", // Light Green
    "#ffa07a", // Light Salmon
    "#e6e6fa", // Light Lavender
    "#fafad2", // Light Goldenrod
    "#f08080", // Light Coral
  ];
  const [usedColors, setUsedColors] = useState([]);

  const getRandomColor = () => {
    return Math.floor(Math.random() * colors.length);
  };
  async function GetLinks(RouteId) {
    if (RouteId) {
      let response = await fetch(`${Api}/get-links?RouteId=${RouteId}`);
      let data = await response.json();
      setLinks(data[0]);
    }
  }
  async function GetRoute() {
    let response = await fetch(`${Api}/get-route?userRouteName=${routeName}`);
    let data = await response.json();
    setRouteDetails(data);
    if (data.message == "No Route Found") {
      navigate("/");
    } else {
      GetLinks(data._id);
    }
    console.log(routeDetails);
  }

  useEffect(() => {
    GetRoute();
  }, []);

  return (
    <div className="bg-yellow-400 w-full min-h-screen flex output-bg">
      <div className="flex flex-col gap-4 mt-[10vh] w-full">
        <div className="w-[100px] mx-auto h-[100px] sm:w-[150px] sm:h-[150px] rounded-full overflow-hidden border-slate-600">
          <img
            src={routeDetails?.profile}
            alt=""
            className="h-full w-full object-cover rounded-full hover:scale-125 transition-all"
          />
        </div>
        <div>
          <div className="flex flex-col gap-2">
            <p className="text-3xl tracking-wider font-bold text-slate-800 text-center">
              {routeDetails?.name}
            </p>
            <p className="text-md font-bold text-black text-center">
              {routeDetails?.about}
            </p>
          </div>
          <div className="w-full sm:max-w-md md:max-w-xl  mx-auto flex flex-col gap-8 py-[2rem] px-[2rem]">
            {links?.linksArray?.map((link, i) => {
              const skewVal = i%2==1?6:-6;
              return (
                <div
                  key={i}
                  style={{ transform: `skewX(${skewVal}deg)` }}
                  className="w-full border-2 border-black   transition-all   output-link-card"
                >
                  <a
                    href={link.link}
                    style={{ backgroundColor: colors[getRandomColor()] }}
                    target="_blank"
                    className="w-full flex p-3 text-center text-black font-bold justify-center"
                  >
                    {link.title}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
