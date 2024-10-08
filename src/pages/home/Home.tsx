import "./Home.css";
import BlueTop from "../../components/hero/Bluetop";
import BlueBottom from "../../components/hero/Bluebottom";
import LeidingsFoto from "../../assets/img/pages/leiding.jpeg";
// import EventsList from "../../components/events/EventsList";
// import Takken from "../../components/takken/Takken";
import HeroSlider from "../../components/hero/HeroSlider";
import { Link } from "react-router-dom";
import DefaultLayout from "../../layouts/DefaultLayout";
import SectionTitle from "../../components/sectionTitle/SectionTitle";
import EventsList from "../../components/events/list/EventsList";
import Takken from "../../components/takken/Takken";

const Home = () => {
	return (
		<DefaultLayout>
			<div className="blueBG">
				<section className="hero__section">
					<div className="layered-grid hero__wrapper">
						<HeroSlider />
						<BlueTop />
					</div>
					<div className="hero__content">
						<h2>KSA Oosterzele</h2>
						<div className="text-container">
							<p>
								Elke zondag van 14u-17u organiseren wij activiteiten vol
								plezier!
							</p>
						</div>
						<Link to="/inschrijven" className="inherit-font cursive">
							Schrijf hier uw kind in
						</Link>
					</div>
					<BlueBottom />
				</section>

				<section className="intro__section page__section">
					<div className="flex__container">
						<img
							src={LeidingsFoto}
							alt="leiding KSA Oosterzele"
							className="round-image"
						/>
						<div className="flex__container--text">
							<SectionTitle title="Wij zijn wij?" invert />
							<p>
								Elke <strong>zondagnamiddag</strong> organiseren wij toffe
								activiteiten voor <strong>jongens van 6 tot 16 jaar</strong>{" "}
								waar plezier en vriendschap centraal staat. <br />
								Naast de zondagnamiddagen gaan wij elk jaar met alle leden op{" "}
								<strong>weekend en op kamp</strong>. Verder organiseert KSA
								Oosterzele verschillende <strong>evenementen</strong> zoals een
								fuif, eetfestijn, quiz, optredens en nog zo veel meer.
							</p>
							<a href="#takken" className="cursive more__link">Klik voor meer informatie</a>
						</div>
					</div>
				</section>
			</div>

			<div className="page__container homepage__container">
				<section className="page__section">
					<div className="home__section--content">
						<SectionTitle title="Komende evenementen">
							<p>
								Hieronder kan u een paar van onze komende evenementen zien die
								wij organiseren. Klik op een activiteit om meer informatie te
								krijgen!
							</p>
						</SectionTitle>
						<EventsList limit={3} />
					</div>
				</section>

				<section className="page__section" id="takken">
					<div className="home__section--content">
						<SectionTitle title="Onze leeftijdsgroepen">
							<p>
								Wij geven leiding aan jongens van 6 tot 16 jaar, hier kan u zien
								tot welke tak jouw kind behoort door te klikken op een
								leeftijdsgroep.
							</p>
						</SectionTitle>
						<Takken />
					</div>
				</section>
			</div>
		</DefaultLayout>
	);
};

export default Home;
