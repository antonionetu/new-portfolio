import Image from "next/image"
import styled from "styled-components"
import { useContext } from "react"
import { ContentContext } from "../.."
import { Main } from "../style"

export const Home = () => {
	const { images } = useContext(ContentContext)

	return (
		<div className="changer">
			<Main>
				<Section>
					<div className="text">
						<p>
							Software developer since 2018 with 4 years of experience, studying
							Computer Systems at RTU and Computer Science at UNIT.
						</p>
						<div className="stacks">
							<p>Backend</p>
							<VerticalLine />
							<p>Frontend</p>
							<VerticalLine />
							<p>Python</p>
							<VerticalLine />
							<p>TypeScript</p>
						</div>
					</div>
					<div className="image-container">
						<Image
							src={images?.profile}
							alt="Foto de Antônio"
							width={200}
							height={200}
							priority
						/>
					</div>
				</Section>
			</Main>
		</div>
	)
}

const Section = styled.section`
	display: flex;
	@media screen and (max-width: 500px) {
		flex-direction: column-reverse;
		width: 90%;
		margin: auto;
		position: relative;
		bottom: 60px;
	}
	align-items: center;
	gap: 1vw;

	div.text {
		width: "25vw";

		p {
			margin-bottom: 2vw;
			@media screen and (max-width: 500px) {
				font-size: 4vw;
				margin-bottom: 10vw;
			}
			text-align: justify;
		}

		div.stacks {
			display: flex;
			gap: 1vw;
			@media screen and (max-width: 500px) {
				gap: 5vw;
			}
			justify-content: center;
			align-items: center;

			p {
				margin: 0px;
			}
		}
	}
	.image-container {
		width: 50%;

		div {
			position: unset !important;
		}

		.image {
			object-fit: contain;
			width: 100% !important;
			height: unset !important;
		}
	}
`

const VerticalLine = styled.div`
	border-left: 2px solid white;
	height: 20px;
`

export default Home
