import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./index.css";

function Section({ title, description, image, isEven = false, onImageHover = () => {}, onImageLeave = () => {} }) {
  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const [currentSound, setCurrentSound] = useState(null);

  const handleImageHover = () => {
    console.log('Image hovered:', title);
    setIsPlaying(true);
    const sound = onImageHover(title);
    setCurrentSound(sound);
  };

  const handleImageLeave = () => {
    console.log('Image left:', title);
    setIsPlaying(false);
    if (currentSound) {
      onImageLeave(currentSound);
      setCurrentSound(null);
    }
  };

  return (
    <motion.section 
      ref={ref}
      style={{ opacity }}
      className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-between px-6 md:px-12 py-24 gap-12 relative overflow-hidden min-h-screen bg-white`}
    >
      {/* Text content */}
      <motion.div 
        className="flex-1 z-20"
        initial={{ x: isEven ? 100 : -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-8 text-black">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-black leading-relaxed max-w-lg">
          {description}
        </p>
      </motion.div>

      <motion.div 
        style={{ y, scale }} 
        className="flex-1 relative group z-20"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-2xl glitch-container">
          <img
            src={image}
            alt={title}
            className={`w-full h-[500px] md:h-[600px] object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110 group-hover:contrast-110 ${isPlaying ? 'animate-pulse' : ''}`}
            onMouseEnter={handleImageHover}
            onMouseLeave={handleImageLeave}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="glitch-overlay"></div>
          </div>

        </div>
      </motion.div>
    </motion.section>
  );
}

function App() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  
  const [audioContext, setAudioContext] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  
  const darkenOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.8]);

  const enableAudio = () => {
    if (!audioContext) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(ctx);
        setIsAudioEnabled(true);
        console.log('Audio enabled!');
      } catch (error) {
        console.log('Audio not supported:', error);
      }
    }
  };

  const createAmbientSound = (frequency, volume, waveType) => {
    console.log('Attempting to play sound:', { frequency, volume, waveType, audioContext, isAudioEnabled });
    
    if (!audioContext || !isAudioEnabled) {
      console.log('Audio not enabled yet - enabling now');
      enableAudio();
      return;
    }

    try {
    
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          console.log('Audio context resumed');
        });
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = waveType;
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      
      console.log(` Playing sound: ${frequency}Hz ${waveType} wave at volume ${volume}`);
      
      return { oscillator, gainNode };
    } catch (error) {
      console.log(' Audio error:', error);
      return null;
    }
  };

  const artworkSounds = {
    "Blooming Perception": () => createAmbientSound(220, 0.1, 'sine'), // Low, mysterious tone
    "Vessel of Echoes": () => createAmbientSound(330, 0.15, 'triangle'), // Echoing, hollow sound
    "Stone That Breathes": () => createAmbientSound(60, 0.04, 'sine'), // Very low, breathing-like
    "The Tree That Sees": () => createAmbientSound(90, 0.03, 'sawtooth'), // Low, ominous, watching
    "Unknown Fragment": () => createAmbientSound(180, 0.18, 'sine'), // Unstable, shifting
    "The Apple and the Moon": () => createAmbientSound(660, 0.08, 'triangle'), // Ethereal, dreamlike
    "Crossed in Red": () => createAmbientSound(70, 0.02, 'square'), // Very low, threatening
    "Smoke and Wing": () => createAmbientSound(100, 0.03, 'sine'), // Low, ethereal, unsettling
  };

  const handleImageHover = (artworkTitle) => {
    console.log('handleImageHover called with:', artworkTitle);
    console.log('Available sounds:', Object.keys(artworkSounds));
    console.log('Audio enabled:', isAudioEnabled);
    
    if (artworkTitle && artworkSounds[artworkTitle]) {
      console.log('Found sound for:', artworkTitle);
      if (!isAudioEnabled) {
        console.log('Enabling audio...');
        enableAudio();
      }
      console.log('Playing sound for:', artworkTitle);
      return artworkSounds[artworkTitle]();
    } else {
      console.log('No sound found for:', artworkTitle);
      return null;
    }
  };

  const handleImageLeave = (soundObject) => {
    if (soundObject && soundObject.oscillator && soundObject.gainNode) {
      try {
        soundObject.gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
        soundObject.oscillator.stop(audioContext.currentTime + 0.2);
        console.log('🔇 Stopping sound');
      } catch (error) {
        console.log('Error stopping sound:', error);
      }
    }
  };

  return (
    <div className="App" onClick={enableAudio}>

      <motion.div 
        className="fixed inset-0 bg-black pointer-events-none z-10"
        style={{ opacity: darkenOpacity }}
      />

      <motion.section 
        ref={heroRef}
        className="relative w-full h-screen flex items-center justify-start overflow-hidden bg-gray-100"
      >
  
        <motion.div 
          style={{ y, scale }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src="/artgal1.jpg"
            alt="Art Gallery Illustration"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-black/30" />

        <div className="absolute inset-0 z-10 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${5 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <motion.div 
          className="relative z-20 px-6 md:px-12 max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1 
            className="font-serif text-6xl md:text-8xl font-bold drop-shadow-lg text-black"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          >
            <motion.span 
              className="block"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Leander's
            </motion.span>
            <motion.span 
              className="block mt-4 md:mt-6 pl-0 md:pl-10"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Art Gallery
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl mt-8 max-w-2xl drop-shadow-sm text-black/80"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Dive into a realm of art that unsettles, invites, and lingers long after you look away
          </motion.p>
        </motion.div>

        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.section>

      <Section
        title="Blooming Perception"
        description="A distorted self-portrait where the eye becomes a flower, symbolizing vision as growth. The tangled curls frame the chaos of thought, blurring the line between identity and imagination."
        image="/art1.jpeg"
        isEven={false}
        onImageHover={handleImageHover}
        onImageLeave={handleImageLeave}
      />

      <Section
        title="Vessel of Echoes"
        description="Half a face, half a vase — the beard and lips morph into a container of abstract blooms. The flower-eye returns, now surrounded by strange designs, turning the body into both subject and object."
        image="/art2.jpeg"
        isEven={true}
        onImageHover={handleImageHover}
        onImageLeave={handleImageLeave}
      />

      <Section
        title="Stone That Breathes"
        description="What seems like a rock is revealed as a meditating being, still but alive. Vibrations ripple from it like unseen energy. Red splatters bleed across the piece, pulling serenity into tension."
        image="/art3.jpeg"
        isEven={false}
        onImageHover={handleImageHover}
        onImageLeave={handleImageLeave}
      />

      <Section
        title="The Tree That Sees"
        description="A towering form of bark and flesh, sprouting three eyes, three mouths, three noses, and only a single leaf. It watches, speaks, and breathes in multiples — yet remains incomplete."
        image="/art4.jpeg"
        isEven={true}
        onImageHover={handleImageHover}
        onImageLeave={handleImageLeave}
      />

      <Section
        title="Unknown Fragment"
        description="An ungraspable shape that resists clear meaning. Its fractured lines invite interpretation, leaving the viewer to project their own imagery onto the form."
        image="/art5.jpeg"
        isEven={false}
        onImageHover={handleImageHover}
        onImageLeave={handleImageLeave}
      />

      <Section
        title="The Apple and the Moon"
        description="Inside a boxed frame stands a barren tree with one apple. Beside it, a figure whose head is only an eye holds a balloon that is the moon. A quiet surreal dialogue between hunger, sight, and dream."
        image="/art6.jpeg"
        isEven={true}
        onImageHover={handleImageHover}
        onImageLeave={handleImageLeave}
      />

      <Section
        title="Crossed in Red"
        description="A faceless figure tied to a cross, body echoing crucifixion yet detached from divinity. A Christmas hat rests on the head, a star hangs above, and red flowers surround the ground. Sacred and absurd, it unsettles belief."
        image="/art7.jpeg"
        isEven={false}
        onImageHover={handleImageHover}
        onImageLeave={handleImageLeave}
      />

      <Section
        title="Smoke and Wing"
        description="An abstract portrait with curls of hair, smoke curling from the lips, and a butterfly hovering nearby. The figure drifts between heaviness and flight, grounded and fleeting at once."
        image="/art8.jpeg"
        isEven={true}
        onImageHover={handleImageHover}
        onImageLeave={handleImageLeave}
      />
    </div>
  );
}

export default App;
