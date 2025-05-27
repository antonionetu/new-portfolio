import styled from "styled-components"
import { Main } from "../style"

export const About = () => {
	return (
		<div className="changer">
			<Main>
				<Section>
					<p style={{ marginBottom: "1vw" }}>
						I started my career in 2018 when I was invited to a course at UFS
						(Federal University of Sergipe), where I began to engage in external
						projects and gained knowledge in various programming languages and
						market technologies. Throughout this journey, I participated in
						several projects proposed by UFS, educational companies, COD3R,
						Fundação Bradesco, Curso em Video, and Udemy courses.
					</p>
					<p style={{ marginBottom: "1vw" }}>
						After UFS, I worked as a freelancer for 2 years, developing websites,
						apps, and systems for various clients and projects. I have been
						working at a startup for 2 years, where I developed skills in
						different technologies and participated in innovative projects.
						During this time, I also worked on two 6-month parallel projects.
						Additionally, I was part of a team that developed a product for a
						large bank in Brazil, collaborating in the creation of
						high-complexity technological solutions.
					</p>
					<p>
						Currently, I am a university student in Computer Science at UNIT and
						am also pursuing Computer Systems at Riga Technical University
						(RTU).
					</p>
				</Section>
			</Main>
		</div>
	)
}

const Section = styled.section`
	@media screen and (max-width: 500px) {
		height: 60vh;
		overflow: scroll;
		padding-right: 20px;
		position: relative;
		bottom: 60px;
	}
	p {
		text-align: justify;
		width: 80%;
		@media screen and (max-width: 500px) {
			width: 80vw;
			font-size: 4.5vw;
		}
	}
`

export default About
