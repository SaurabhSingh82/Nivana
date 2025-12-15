
import { useState } from "react";
import { motion } from "framer-motion";
import TweetCardStack from "./TweetCardStack";
import React from "react";
import { useEffect } from "react"; 
import { useRef } from "react";
import "./LandingPage2.css";
import FeatureServices from "./FeatureServices";
import ButterFlyLayer from "./ButterFlyLayer";
import NavBar from "./NavBar";
import HeroSection from "./HeroSection";
import About from "./About";
import Journey from "./Journey";
import CTA from "./CTA";
import Footer from "./Footer";
import {useNavigate} from 'react-router-dom';


export default function LandingPage() {
  const [aboutIndex, setAboutIndex] = useState(0);

  return (
    <div className="min-h-screen w-full bg-background text-foreground overflow-x-hidden ">
      {/* Joyful Nature Background Elements */}
      <ButterFlyLayer></ButterFlyLayer>

      {/* NAVBAR */}
      <NavBar></NavBar>

      {/* HERO */}
      <HeroSection></HeroSection>

      {/* ABOUT SECTION */}
      <About></About>

      {/* FEATURED SERVICES — UPDATED SECTION */}
      <FeatureServices></FeatureServices>
      

      {/* JOURNEY SECTION (unchanged) */}
      <Journey></Journey>

      {/* COMMUNITY SECTION */}
     <TweetCardStack />


      {/* CTA SECTION */}
      <CTA></CTA>
      {/* FOOTER */}
      <Footer></Footer>
    </div>
  );
}
