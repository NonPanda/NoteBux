import React, { useState } from 'react';
import { Button, Carousel } from 'react-bootstrap';
import './Landing.css'; 
import heroImage1 from '../assets/images/Group1.svg';
import heroImage2 from '../assets/images/Group2.svg';
import heroImage3 from '../assets/images/Group3.svg';
import leftArrow from '../assets/icons/arrow-left.svg';
import rightArrow from '../assets/icons/arrow-right.svg';
import { signInWithPopup, auth, provider } from '../firebaseConfig';

const Landing = () => {
  const [index, setIndex] = useState(0); 
  const carouselItems = [
    {
      image: heroImage1,
      title: 'A Digital Notebook',
      description: 'A streamlined app for creating, organizing, and managing notes and drafts effortlessly.',
    },
    {
      image: heroImage2,
      title: 'Organize Your Thoughts',
      description: 'Easily categorize and search through your notes with powerful organization tools.',
    },
    {
      image: heroImage3,
      title: 'Access Anywhere, Anytime',
      description: 'Your notes are always at your fingertips, whether online or offline.',
    },
  ];

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  const handlePrev = () => {
    setIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      console.log("User Info: ", loggedInUser);
    } catch (error) {
      console.error("Login Error: ", error);
    }
  };
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center py-5">
        <div className="container">
          <Carousel
            className="carousel-container mb-4"
            activeIndex={index}
            onSelect={() => {}} 
            interval={null} 
            prevIcon={<img src={leftArrow} alt="Previous" className="carousel-arrow" onClick={handlePrev} />}
            nextIcon={<img src={rightArrow} alt="Next" className="carousel-arrow" onClick={handleNext} />}
          >
            {carouselItems.map((item, idx) => (
              <Carousel.Item key={idx}>
                <img
                  className="d-block mx-auto carousel-image"
                  src={item.image}
                  alt={item.title}
                />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>

          

          <div className="custom-indicators">
            {carouselItems.map((_, idx) => (
              <div
                key={idx}
                className={`custom-indicator ${index === idx ? 'active' : ''}`}
              ></div>
            ))}
          </div>

          <Button variant="danger" className="cta-button" onClick={handleGoogleLogin}>
            GET STARTED
          </Button>
          <p className="mt-3">
            <a href="/drafts" className="login-link">Already signed in?</a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Landing;




