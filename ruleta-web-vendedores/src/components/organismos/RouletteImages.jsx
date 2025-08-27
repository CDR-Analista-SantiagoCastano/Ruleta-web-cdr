// Archivo: RouletteImages.js

import Marquee from "react-fast-marquee";
import styled from "styled-components";

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 0 0.2rem;
  
  img {
    max-height: 100%;
    max-width: 100%;
  }
`;

export function RouletteImages() {
    return (
        <Marquee speed={30} autoFill>
            <Item><img src="GSP.png" alt="test" /></Item>
            <Item><img src="koyo.png" alt="test" /></Item>
            <Item><img src="REDIX.jpg" alt="otra" /></Item>
            <Item><img src="hella.png" alt="otra" /></Item>
            <Item><img src="MAGIK TUBE  TIRE.jpg" alt="otra" /></Item>
            <Item><img src="PIRELLI.png" alt="otra" /></Item>
            <Item><img src="VEE RUBBER LOGO 2021.jpg" alt="otra" /></Item>
            <Item><img src="Narva.jpg" alt="otra" /></Item>
            <Item><img src="JohnCrane.jpg" alt="otra" /></Item>
            <Item><img src="JAPAN.jpg" alt="otra" /></Item>
            <Item><img src="NTN.png" alt="otra" /></Item>
            <Item><img src="LYO.jpg" alt="otra" /></Item>
            <Item><img src="NGK.png" alt="otra" /></Item>
            <Item><img src="TRANSEJES.png" alt="otra" /></Item>
            <Item><img src="PFI.png" alt="otra" /></Item>
            <Item><img src="FORERUNNER.png" alt="otra" /></Item>
            <Item><img src="SPICER.jpg" alt="otra" /></Item>
            <Item><img src="MERITOR.png" alt="otra" /></Item>
            <Item><img src="HCH.jpg" alt="otra" /></Item>
        </Marquee>
    );
}