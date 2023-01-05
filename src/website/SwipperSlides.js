import React, { Component } from "react";
import SlidderImage from "./assets/carousel-2.jpg";

import { Carousel } from "react-bootstrap";

import "./style/caroselStyles.scss";
// Importing the Bootstrap CSS
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
export default class BannerSwipper extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="swipperContainer">
        {/* <Carousel className="h-100">
          <Carousel.Item className="h-100">
            <img
              src={SlidderImage}
              alt="Images"
              className="d-block w-100 h-100"
            />

            <Carousel.Caption>
              <h3 className="text-white">Washing & Detailing</h3>
              <h1 className="text-white">Keep your Car Newer</h1>
              <p>
                Lorem ipsum dolor sit amet elit. Phasellus ut mollis mauris.
                Vivamus egestas eleifend dui ac
              </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item className="h-100">
            <img
              src={SlidderImage}
              alt="Images"
              className="d-block w-100 h-100"
            />

            <Carousel.Caption>
              <h3 className="text-white">Washing & Detailing</h3>
              <h1 className="text-white">Keep your Car Newer</h1>
              <p>
                Lorem ipsum dolor sit amet elit. Phasellus ut mollis mauris.
                Vivamus egestas eleifend dui ac
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel> */}

        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          onSlideChange={() => console.log("slide change")}
          modules={[Navigation, Pagination, A11y]}
          onSwiper={(swiper) => console.log(swiper)}
          navigation
          pagination={{ clickable: true }}
        >
          <SwiperSlide>
            <div
              style={{ backgroundImage: `url(${SlidderImage})` }}
              className="swiperSlide"
            >
              <h3 className="text-white">Washing & Detailing</h3>
              <h1 className="text-white">Keep your Car Newer</h1>
              <p>
                Lorem ipsum dolor sit amet elit. Phasellus ut mollis mauris.
                Vivamus egestas eleifend dui ac
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              style={{ backgroundImage: `url(${SlidderImage})` }}
              className="swiperSlide"
            >
              <h3 className="text-white">Washing & Detailing</h3>
              <h1 className="text-white">Keep your Car Newer</h1>
              <p>
                Lorem ipsum dolor sit amet elit. Phasellus ut mollis mauris.
                Vivamus egestas eleifend dui ac
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    );
  }
}

{
  /* <Carousel className="h-100">
{this.props.slidders &&
  this.props.slidders.map((item) => {
    return (
      <Carousel.Item className="h-100" key={item.id}>
        <img
          src={item.image}
          alt="Images"
          className="d-block w-100 h-100"
        />

        <Carousel.Caption>
          <h3 className="text-white">{item.heading}</h3>
          <h1 className="text-white">{item.sub_heading}</h1>
          <p>{item.content}</p>
        </Carousel.Caption>
      </Carousel.Item>
    );
  })}
</Carousel> */
}
