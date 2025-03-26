import "../css/AboutUs.css";
import sujal from "../assets/sujalVadgama.jpg";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

// eslint-disable-next-line react/prop-types
const TeamMemberCard = ({ name, position, imgSrc, social }) => {
  return (
    <div className="column">
      <div className="card">
        <div>
          <img className="img-container" src={imgSrc} alt={name} />
        </div>
        <h3>{name}</h3>
        <p>{position}</p>
        <div className="icons">
          {// eslint-disable-next-line react/prop-types
          social.map((link, index) => (
            <a href={link.url} key={index} target="_blank">
              <i className={link.icon}></i>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const TeamSection = ({ teamData }) => {
  return (
    <>
      <Navbar />
      <section className="root1">
        <div className="row">
          <h1 className="h11">Our Team</h1>
        </div>
        <div className="row">
          {// eslint-disable-next-line react/prop-types
          teamData.map((member, index) => (
            <TeamMemberCard key={index} {...member} />
          ))}
        </div>
      </section>
    </>
  );
};

const jsonData = [
  {
    name: "Sujal Vadgama",
    position: "Full Stack Developer",
    imgSrc: sujal,
    social: [
      { url: "https://x.com/vadgamasujal15", icon: "fab fa-twitter" },
      {
        url: "https://www.linkedin.com/in/sujalvadgama/",
        icon: "fab fa-linkedin",
      },
      { url: "https://github.com/sujalvadgama77", icon: "fab fa-github" },
    ],
  }
];

const App = () => {
  return (
    <>
      <div>
        <TeamSection teamData={jsonData} />
      </div>
      <Footer />
    </>
  );
};

export default App;
