import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import SpacePortfolioBackground from './components/SpacePortfolioBackground';

import SpaceOpening from './components/scenes/DeepSpace';
import EarthZoom from './components/scenes/EarthZoom';

import CityOverview from './components/city/CityOverview';
import CentralPlaza from './components/city/CentralPlaza';
import SkillsTower from './components/city/SkillsTower';
import ProjectDistrict from './components/city/ProjectDistrict';
import CertificateMuseum from './components/city/CertificateMuseum';
import GitHubPowerPlant from './components/city/GitHubPowerPlant';
import LearningHub from './components/city/LearningHub';
import VisionTower from './components/city/VisionTower';
import ControlCenter from './components/city/ControlCenter';
import ContactDistrict from './components/city/ContactDistrict';

/*
  Cinematic flow — 3 scenes:
  1 = Solar System (orbiting planets, stars, comets) → "Get Started"
  2 = Earth Zoom (realistic Earth → India → Mumbai) → "Know About Me"
  3 = Scrollable portfolio with persistent animated Solar System background
*/

export default function App() {
  const [scene, setScene] = useState(1);

  const toZoom = useCallback(() => setScene(2), []);
  const toPortfolio = useCallback(() => setScene(3), []);

  return (
    <div className="relative">
      <CustomCursor />

      {/* Scene 1: Solar System Opening */}
      <AnimatePresence>
        {scene === 1 && (
          <motion.div key="space" className="fixed inset-0 z-50"
            initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <SpaceOpening onComplete={toZoom} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene 2: Earth Zoom → India → Mumbai */}
      <AnimatePresence>
        {scene === 2 && (
          <motion.div key="earth" className="fixed inset-0 z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <EarthZoom onArrived={toPortfolio} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene 3: Scrollable portfolio with persistent animated Solar System background */}
      <AnimatePresence>
        {scene === 3 && (
          <motion.div key="portfolio" className="relative z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
            <SpacePortfolioBackground />
            <Navbar />
            <div className="relative z-20 flex flex-col min-h-screen">
              <CityOverview />
              <div className="container mx-auto px-4 py-8">
                <CentralPlaza />
                <SkillsTower />
                <ProjectDistrict />
                <CertificateMuseum />
                <GitHubPowerPlant />
                <LearningHub />
                <VisionTower />
                <ControlCenter />
                <ContactDistrict />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}