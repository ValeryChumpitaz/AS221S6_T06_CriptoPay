import React from "react";
import "../../styles/landingPage/NavigationPages.css";
import { useLanguage } from "./translate/LanguageContext";

const NavigationPages = () => {
  const { texts } = useLanguage();

  return (
    <div className="navigation-pages">
      {/* DESCRIPCIÓN SECCIÓN */}
      <div id="description" className="project-description-container">
        <div className="description-content">
          <h3 className="category">{texts.project.category}</h3>
          <h2>{texts.project.title}</h2>
          <p>{texts.project.content}</p>
        </div>
        <div className="image-container">
          <img
            src={require("../../assets/vg3.jpg")}
            alt={texts.project.category}
          />
        </div>
      </div>

      {/* OBJETIVOS SECCIÓN */}
      <section id="objectives" className="services-section">
        <h3 className="category">{texts.objectives.title}</h3>
        <h2 className="section-title">{texts.objectives.title}</h2>
        <div className="services-container">
          {texts.objectives.items.map((item, index) => (
            <div
              key={index}
              className={`service-item ${
                item.highlighted ? "highlighted" : ""
              }`}
            >
              <img
                src={require(`../../assets/${item.icon}`)}
                alt={item.title}
                className="service-icon"
              />
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CARACTERISTICAS SECCIÓN */}
      <div id="features" className="features-section">
        <div className="image-wrapper">
          <img
            src={require("../../assets/vg1.jpg")}
            alt="Descripción de la imagen"
          />
        </div>
        <div className="features-content">
          <h3 className="features">{texts.features.subtitle}</h3>
          <h2 className="section-title">{texts.features.title}</h2>

          {texts.features.items.map((item, index) => (
            <div key={index} className="feature-item">
              <img
                src={require(`../../assets/${item.icon}`)}
                alt={item.title}
                className="feature-icon"
              />
              <p>
                <strong>{item.title}:</strong> {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* BENEFICIOS SECCIÓN */}
      <div id="benefits" className="top-values-container">
        <h3 className="benefits">{texts.benefits.subtitle}</h3>
        <h2 className="section-title">{texts.benefits.title}</h2>
        <div className="values">
          {texts.benefits.items.map((item, index) => (
            <div key={index} className="value-item">
              <img
                src={require(`../../assets/${item.icon}`)}
                alt={item.title}
              />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* INTEGRANTES SECCIÓN */}
      <div id="team" className="top-values-container">
        <h3 className="team">{texts.team.subtitle}</h3>
        <h2 className="section-title">{texts.team.title}</h2>
        <div className="trip-card">
          {texts.team.members.map((member, index) => (
            <div key={index}>
              <img
                src={require(`../../assets/${member.image}`)}
                alt={member.name}
                className="trip-image"
              />
              <div className="trip-details">
                <h4>{member.name}</h4>
                <p>{member.role}</p>
                <div className="trip-stats">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={require("../../assets/githublogo.png")}
                      alt="GitHub"
                      className="social-icon"
                    />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={require("../../assets/linkdlnlogo.png")}
                      alt="LinkedIn"
                      className="social-icon"
                    />
                  </a>
                </div>
                <div className="ongoing-trip">
                  <div className="progress-bar">
                    <div className="progress" style={{ width: "40%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONCLUSIONES SECCIÓN */}
      <div id="conclusions" className="project-description-container">
        <div className="description-content">
          <h3 className="conclusions">{texts.conclusions.subtitle}</h3>
          <h2>{texts.conclusions.title}</h2>
          <p>{texts.conclusions.description}</p>
        </div>
        <div className="image-container">
          <img
            src={require("../../assets/vg2.jpg")}
            alt="Descripción de la imagen"
          />
        </div>
      </div>

      {/* FOORTER SECCIÓN */}
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-logo-section">
            <img
              src={require("../../assets/metamask.png")}
              alt="CryptoPay Logo"
              className="footer-logo"
            />
            <p>{texts.footer.logoDescription}</p>
          </div>

          <div className="footer-links-section">
            <div className="footer-column">
              <h4>{texts.footer.about}</h4>
              <ul>
                <li>
                  <a href="#">{texts.footer.aboutLinks.aboutCryptoPay}</a>
                </li>
                <li>
                  <a href="#">{texts.footer.aboutLinks.team}</a>
                </li>
                <li>
                  <a href="#">{texts.footer.aboutLinks.careers}</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>{texts.footer.support}</h4>
              <ul>
                <li>
                  <a href="#">{texts.footer.supportLinks.help}</a>
                </li>
                <li>
                  <a href="#">{texts.footer.supportLinks.contact}</a>
                </li>
                <li>
                  <a href="#">{texts.footer.supportLinks.reportProblem}</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>{texts.footer.resources}</h4>
              <ul>
                <li>
                  <a href="#">{texts.footer.resourcesLinks.userGuide}</a>
                </li>
                <li>
                  <a href="#">{texts.footer.resourcesLinks.networkFees}</a>
                </li>
                <li>
                  <a href="#">{texts.footer.resourcesLinks.securityTips}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{texts.footer.rightsReserved}</p>
        </div>
      </footer>
    </div>
  );
};

export default NavigationPages;
