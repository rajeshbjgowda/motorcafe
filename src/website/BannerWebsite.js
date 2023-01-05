import React, { useEffect, useState } from "react";
import "./style/styles.css";
import WebNavBar from "./Navbar";
import BannerSwipper from "./SwipperSlides";
import { useForm } from "react-hook-form";
import { addDoc, getFirestore } from "firebase/firestore/lite";
import { app, auth, fireStore } from "../admin/containers/firebase";
import { collection } from "firebase/firestore/lite";
import AboutImage from "./assets/about.jpg";
import { AiFillCar } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  getSliddersData,
  getWebDetailsData,
  getWebEmployeesData,
  getWebServicesData,
} from "../admin/redux/actions/Homesection";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { onAuthStateChanged } from "firebase/auth";

const BannerWebsite = () => {
  const dispatch = useDispatch();
  const slidders = useSelector((state) => state.homeSectionReducer.slidders);

  const user = useSelector((state) => state.authUserReducer);
  const carServices = useSelector(
    (state) => state.homeSectionReducer.webServices
  );
  const employees = useSelector((state) => state.homeSectionReducer.employees);
  const garage_Details = useSelector(
    (state) => state.homeSectionReducer.garage_Details
  );

  const db = getFirestore(app);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const enquiryRef = collection(fireStore, "enquires");
  const handleSubmiEnquires = async (data) => {
    console.log(data);
    const enquiry = {
      email: data.email,
      message: data.message,
      name: data.name,
      phone_number: data.phone_number,
    };
    try {
      await addDoc(enquiryRef, enquiry);
    } catch (error) {
      console.log("somthing went wrong");
    }
    reset();
  };

  useEffect(() => {
    dispatch(getSliddersData());
    dispatch(getWebServicesData());
    dispatch(getWebEmployeesData());
    dispatch(getWebDetailsData());
  }, []);
  // const { currentUser } = auth();
  console.log("user", user);

  return (
    <div>
      {/* <!-- Top Bar Start --> */}
      <div className="top-bar">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4 col-md-12">
              <div className="logo">
                <a href="index.html">
                  <h1>
                    Motor<span>Cafe</span>
                  </h1>
                  {/* <!-- <img src="img/logo.jpg" alt="Logo"> --> */}
                </a>
              </div>
            </div>
            <div className="col-lg-8 col-md-7 d-none d-lg-block">
              <div className="row">
                <div className="col-4">
                  <div className="top-bar-item">
                    <div className="top-bar-icon">
                      <i className="far fa-clock"></i>
                    </div>
                    <div className="top-bar-text">
                      <h3>Opening Hour</h3>
                      <p>Mon - Fri, 8:00 - 9:00</p>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="top-bar-item">
                    <div className="top-bar-icon">
                      <i className="fa fa-phone-alt"></i>
                    </div>
                    <div className="top-bar-text">
                      <h3>Call Us</h3>
                      <p>+012 345 6789</p>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="top-bar-item">
                    <div className="top-bar-icon">
                      <i className="far fa-envelope"></i>
                    </div>
                    <div className="top-bar-text">
                      <h3>Email Us</h3>
                      <p>info@example.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Top Bar End --> */}
      <WebNavBar />

      <BannerSwipper slidders={slidders} />

      {/* <!-- About Start --> */}
      <div className="about">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-img">
                <img src={AboutImage} alt="about" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-header text-left">
                <p>About Us</p>
                <h2>car washing and detailing</h2>
              </div>
              <div className="about-content">
                <p>
                  Lorem ipsum dolor sit amet elit. In vitae turpis. Donec in
                  hendre dui, vel blandit massa. Ut vestibu suscipi cursus. Cras
                  quis porta nulla, ut placerat risus. Aliquam nec magna eget
                  velit luctus dictum
                </p>
                <ul>
                  <li>
                    <i className="far fa-check-circle"></i>Seats washing
                  </li>
                  <li>
                    <i className="far fa-check-circle"></i>Vacuum cleaning
                  </li>
                  <li>
                    <i className="far fa-check-circle"></i>Interior wet cleaning
                  </li>
                  <li>
                    <i className="far fa-check-circle"></i>Window wiping
                  </li>
                </ul>
                <a className="btn btn-custom" href="">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- About End --> */}

      {/* <!-- Service Start --> */}
      <div className="service">
        <div className="container">
          <div className="section-header text-center">
            <p>What We Do?</p>
            <h2>Premium Car Services</h2>
          </div>
          <div className="row">
            {carServices &&
              carServices.map((item) => {
                return (
                  <div className="col-lg-3 col-md-6" key={item.id}>
                    <div className="service-item">
                      {/* <i className="flaticon-car-wash-1"></i> */}
                      <img
                        src={item.image}
                        width="60px"
                        height="60px"
                        alt="images"
                      />

                      <h3>{item.heading}</h3>
                      <p>{item.content}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {/* <!-- Service End --> */}

      {/* <!-- Facts Start --> */}
      {/* <div className="facts" data-parallax="scroll" data-image-src="img/facts.jpg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6">
                            <div className="facts-item">
                                <i className="fa fa-map-marker-alt"></i>
                                <div className="facts-text">
                                    <h3 data-toggle="counter-up">25</h3>
                                    <p>Service Points</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="facts-item">
                                <i className="fa fa-user"></i>
                                <div className="facts-text">
                                    <h3 data-toggle="counter-up">350</h3>
                                    <p>Engineers & Workers</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="facts-item">
                                <i className="fa fa-users"></i>
                                <div className="facts-text">
                                    <h3 data-toggle="counter-up">1500</h3>
                                    <p>Happy Clients</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="facts-item">
                                <i className="fa fa-check"></i>
                                <div className="facts-text">
                                    <h3 data-toggle="counter-up">5000</h3>
                                    <p>Projects Completed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
      {/* <!-- Facts End --> */}

      {/* <!-- Price Start --> */}
      <div className="price">
        <div className="container">
          <div className="section-header text-center">
            <p>Washing Plan</p>
            <h2>Choose Your Plan</h2>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="price-item">
                <div className="price-header">
                  <h3>Basic Cleaning</h3>
                  <h2>
                    <span>$</span>
                    <strong>25</strong>
                    <span>.99</span>
                  </h2>
                </div>
                <div className="price-body">
                  <ul>
                    <li>
                      <i className="far fa-check-circle"></i>Seats Washing
                    </li>
                    <li>
                      <i className="far fa-check-circle"></i>Vacuum Cleaning
                    </li>
                    <li>
                      <i className="far fa-check-circle"></i>Exterior Cleaning
                    </li>
                    <li>
                      <i className="far fa-times-circle"></i>Interior Wet
                      Cleaning
                    </li>
                    <li>
                      <i className="far fa-times-circle"></i>Window Wiping
                    </li>
                  </ul>
                </div>
                <div className="price-footer">
                  <a className="btn btn-custom" href="">
                    Book Now
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="price-item featured-item">
                <div className="price-header">
                  <h3>Premium Cleaning</h3>
                  <h2>
                    <span>$</span>
                    <strong>35</strong>
                    <span>.99</span>
                  </h2>
                </div>
                <div className="price-body">
                  <ul>
                    <li>
                      <i className="far fa-check-circle"></i>Seats Washing
                    </li>
                    <li>
                      <i className="far fa-check-circle"></i>Vacuum Cleaning
                    </li>
                    <li>
                      <i className="far fa-check-circle"></i>Exterior Cleaning
                    </li>
                    <li>
                      <i className="far fa-check-circle"></i>Interior Wet
                      Cleaning
                    </li>
                    <li>
                      <i className="far fa-times-circle"></i>Window Wiping
                    </li>
                  </ul>
                </div>
                <div className="price-footer">
                  <a className="btn btn-custom" href="">
                    Book Now
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="price-item">
                <div className="price-header">
                  <h3>Complex Cleaning</h3>
                  <h2>
                    <span>$</span>
                    <strong>49</strong>
                    <span>.99</span>
                  </h2>
                </div>
                <div className="price-body">
                  <ul>
                    <li>
                      <i className="far fa-check-circle"></i>Seats Washing
                    </li>
                    <li>
                      <i className="far fa-check-circle"></i>Vacuum Cleaning
                    </li>
                    <li>
                      <i className="far fa-check-circle"></i>Exterior Cleaning
                    </li>
                    <li>
                      <i className="far fa-check-circle"></i>Interior Wet
                      Cleaning
                    </li>
                    <li>
                      <i className="far fa-check-circle"></i>Window Wiping
                    </li>
                  </ul>
                </div>
                <div className="price-footer">
                  <a className="btn btn-custom" href="">
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Price End --> */}

      {/* <!-- Location Start --> */}
      <div className="location">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="section-header text-left">
                <p>Washing Points</p>
                <h2>Car Washing & Care Points</h2>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="location-item">
                    <i className="fa fa-map-marker-alt"></i>
                    <div className="location-text">
                      <h3>Car Washing Point</h3>
                      <p>123 Street, New York, USA</p>
                      <p>
                        <strong>Call:</strong>+012 345 6789
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="location-item">
                    <i className="fa fa-map-marker-alt"></i>
                    <div className="location-text">
                      <h3>Car Washing Point</h3>
                      <p>123 Street, New York, USA</p>
                      <p>
                        <strong>Call:</strong>+012 345 6789
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="location-item">
                    <i className="fa fa-map-marker-alt"></i>
                    <div className="location-text">
                      <h3>Car Washing Point</h3>
                      <p>123 Street, New York, USA</p>
                      <p>
                        <strong>Call:</strong>+012 345 6789
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="location-item">
                    <i className="fa fa-map-marker-alt"></i>
                    <div className="location-text">
                      <h3>Car Washing Point</h3>
                      <p>123 Street, New York, USA</p>
                      <p>
                        <strong>Call:</strong>+012 345 6789
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="location-form">
                <h3>Request for a car wash</h3>
                <form onSubmit={handleSubmit(handleSubmiEnquires)}>
                  <div className="control-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      required="required"
                      {...register("name")}
                    />
                  </div>
                  <div className="control-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      required="required"
                      {...register("email")}
                    />
                  </div>
                  <div className="control-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Phone Number"
                      required="required"
                      {...register("phone_number")}
                    />
                  </div>
                  <div className="control-group">
                    <textarea
                      className="form-control"
                      placeholder="Description"
                      required="required"
                      {...register("message")}
                    ></textarea>
                  </div>
                  <div>
                    <button className="btn btn-custom" type="submit">
                      Send Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Location End --> */}

      {/* <!-- Team Start --> */}
      <div className="team">
        <div className="container">
          <div className="section-header text-center">
            <p>Meet Our Team</p>
            <h2>Our Engineers & Workers</h2>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="team-item">
                <div className="team-img">
                  <img src="img/team-1.jpg" alt="Team Image" />
                </div>
                <div className="team-text">
                  <h2>Donald John</h2>
                  <p>Engineer</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="team-item">
                <div className="team-img">
                  <img src="img/team-2.jpg" alt="Team Image" />
                </div>
                <div className="team-text">
                  <h2>Adam Phillips</h2>
                  <p>Engineer</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="team-item">
                <div className="team-img">
                  <img src="img/team-3.jpg" alt="Team Image" />
                </div>
                <div className="team-text">
                  <h2>Thomas Olsen</h2>
                  <p>Worker</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="team-item">
                <div className="team-img">
                  <img src="img/team-4.jpg" alt="Team Image" />
                </div>
                <div className="team-text">
                  <h2>James Alien</h2>
                  <p>Worker</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Team End --> */}

      {/* <!-- Testimonial End --> */}

      {/* <!-- Blog Start --> */}

      {/* <!-- Blog End --> */}

      {/* <!-- Footer Start --> */}
      <div className="footer">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-4 col-md-6">
              <div className="footer-contact">
                <h2>Get In Touch</h2>
                <p>
                  <i className="fa fa-map-marker-alt"></i>123 Street, New York,
                  USA
                </p>
                <p>
                  <i className="fa fa-phone-alt"></i>+012 345 67890
                </p>
                <p>
                  <i className="fa fa-envelope"></i>info@example.com
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="footer-link">
                <h2>Popular Links</h2>
                <div className="footer-social">
                  <a className="btn" href="">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a className="btn" href="">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a className="btn" href="">
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a className="btn" href="">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a className="btn" href="">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="footer-link">
                <h2>Popular Links</h2>
                <a href="">About Us</a>
                <a href="">Contact Us</a>
                <a href="">Our Service</a>
                <a href="">Service Points</a>
                <a href="">Pricing Plan</a>
              </div>
            </div>
          </div>
        </div>
        <div className="container copyright">
          <p>
            &copy; <a href="#">Your Site Name</a>, All Right Reserved. Designed
            By
            <a href="https://htmlcodex.com">HTML Codex</a>
          </p>
        </div>
      </div>
      {/* <!-- Footer End --> */}
    </div>
  );
};

export default BannerWebsite;
