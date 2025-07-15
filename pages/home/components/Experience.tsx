/* eslint-disable @next/next/no-img-element */
import Image from "next/image"
import { useContext } from "react"
import styled from "styled-components"
import { ContentContext, newCloudinaryBaseUrl } from "../.."
import { Main } from "../style"

interface PropsType {
	link: string
	image: string
	blurImageUrl: string
	title: string
	description: string
	date: string
}

export const Experience = () => {
	const { images } = useContext(ContentContext)
	const experiences_images = images?.experiences

	const experiences = [
		{
			title: "UFS - Universidade Federal de Sergipe",
			description:
				"Completed a course at UFS, engaging in external projects and gaining knowledge in various programming languages and technologies.",
			link: "https://www.ufs.br",
			image: experiences_images?.ufs,
			blurImageUrl: experiences_images?.ufs,
			date: "2018",
		},
		{
			title: "Freelancer",
			description:
				"Worked as a freelancer for 2 year, developing websites, apps, and systems for various clients and projects.",
			image: experiences_images?.freelancer,
			blurImageUrl: experiences_images?.freelancer,
			date: "2020 - 2022",
		},
		{
			title: "Computer Science at UNIT",
			description:
				"Currently studying Computer Science at UNIT, expanding both academic and practical knowledge in the field.",
			link: "https://www.unit.br",
			image: experiences_images?.unit,
			blurImageUrl: experiences_images?.unit,
			date: "2023 - Present",
		},
		{
			title: "Quantum educ.",
			description:
				"Worked in a startup for almost 2 years, developing skills in different technologies and participating in innovative projects.",
			link: "https://quantumeduc.com",
			image: experiences_images?.quantum,
			blurImageUrl: experiences_images?.quantum,
			date: "2023 - Present",
		},
		{
			title: "Tiradentes Group",
			description:
				"In partnership with PortoDigital, we present improvements to Unit's educational system, Magister.",
			link: "https://www.unit.br",
			image: experiences_images?.tiradentesGroup,
			blurImageUrl: experiences_images?.tiradentesGroup,
			date: "2023",
		},
		{
			title: "Apoio Fiel",
			description:
				"In partnership with PortoDigital, we created a solution to help NGOs manage donations.",
			image: experiences_images?.apoioFiel,
			blurImageUrl: experiences_images?.apoioFiel,
			date: "2024",
		},
		{
			title: "Sinqia",
			description:
				"Part of a team that developed a product for a major bank in Brazil, working on high-complexity technological solutions.",
			link: "https://sinqia.com.br",
			image: experiences_images?.sinqia,
			blurImageUrl: experiences_images?.sinqia,
			date: "2024",
		},
		{
		  title: "Computer Systems at RTU",
		  description:
		    "Currently pursuing Computer Systems at Riga Technical University (RTU) for international exposure.",
		  link: "https://www.rtu.lv",
		  image: experiences_images?.rtu,
		  blurImageUrl: experiences_images?.rtu,
		  date: "2025 - Present",
		}
	]

	return (
		<div className="changer">
			<Main>
				<Timeline>
					{experiences.map((experience, index) => (
						<Item
							key={index}
							image={experience.image}
							blurImageUrl={experience.blurImageUrl}
							link={experience.link}
							title={experience.title}
							description={experience.description}
							date={experience.date}
						/>
					))}
				</Timeline>
			</Main>
		</div>
	)
}

const Timeline = styled.div`
	display: flex;
	flex-direction: column;
	gap: 3rem;
	padding: 2rem;
	max-height: 70vh;
	overflow-y: auto;
	::-webkit-scrollbar {
		width: 8px;
	}
	::-webkit-scrollbar-thumb {
		background-color: #888;
		border-radius: 10px;
	}
	::-webkit-scrollbar-thumb:hover {
		background-color: #555;
	}
`

const Item = ({
	link,
	image,
	blurImageUrl,
	title,
	description,
	date,
}: PropsType) => {
	return (
		<TimelineItem>
			<ImageWrapper>
				<Image
					src={`${newCloudinaryBaseUrl}/${image}`}
					alt={title}
					width={125}
					height={100}
					layout="responsive"
					placeholder="blur"
					blurDataURL={`${newCloudinaryBaseUrl}/e_blur:1800/experiences_images/experiences_images/${blurImageUrl}`}
				/>
			</ImageWrapper>
			<Content>
				<h3>
					{title} <span>{date}</span>
				</h3>
				<p>{description}</p>
				{link && (
					<a href={link} target="_blank" rel="noreferrer">
						Learn More{" "}
						<img src="/linkIcon.png" alt="Link icon" className="linkIcon" />
					</a>
				)}
			</Content>
		</TimelineItem>
	)
}

const TimelineItem = styled.div`
	display: flex;
	align-items: center;
	gap: 2rem;
	position: relative;
	&:before {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		border-left: 2px solid #cccccc;
	}

	&:nth-child(even):before {
		top: auto;
		bottom: 0;
	}
`

const ImageWrapper = styled.div`
	width: 150px;
	height: 120px;
	border-radius: 10px;
	overflow: hidden;
	margin-left: 8px;
`

const Content = styled.div`
	flex: 1;

	h3 {
		font-size: 1.2rem;
		margin: 0;
		span {
			font-size: 0.8rem;
			color: #888;
		}
	}

	p {
		margin: 0.5rem 0;
		font-size: 1rem;
	}

	a {
		text-decoration: none;
		color: #0066cc;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;

		.linkIcon {
			width: 12px;
		}

		&:hover {
			text-decoration: underline;
		}
	}
`

export default Experience
