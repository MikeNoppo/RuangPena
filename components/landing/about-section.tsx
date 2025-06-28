import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Shield } from "lucide-react"
import { AnimatedSection } from "./animated-section"
import Image from "next/image"

const aboutFeatures = [
	{
		icon: Users,
		title: "Komunitas Supportif",
		description:
			"Bergabung dengan komunitas yang peduli dengan kesehatan mental dan pertumbuhan pribadi.",
	},
	{
		icon: Shield,
		title: "Privasi Terjamin",
		description: "Data dan catatan pribadi Anda dilindungi.",
	},
	{
		icon: Target,
		title: "Pertumbuhan Berkelanjutan",
		description:
			"Kami memiliki materi yang bisa anda baca untuk membantu Anda memahami pola dan kemajuan diri.",
	},
]

export function AboutSection() {
	return (
		<AnimatedSection>
			<section
				id="tentang"
				className="about-section py-12 sm:py-20 bg-gray-50"
				aria-labelledby="about-heading"
			>
				<div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<header className="section-header text-center mb-12 sm:mb-16">
						<h2
							id="about-heading"
							className="section-title text-2xl sm:text-3xl font-light text-gray-900 mb-4"
						>
							Tentang RuangPena
						</h2>
					</header>

					{/* Creator Profile Section */}
					<div className="creator-profile max-w-4xl mx-auto mb-16 sm:mb-20">
						<AnimatedSection>
							<Card className="overflow-hidden shadow-lg border-0">
								<div className="flex flex-col md:flex-row">
									<div className="md:w-1/3 relative h-64 md:h-auto">
										<Image
											src="/creator-profile.jpg" // Pastikan gambar ada di folder public
											alt="Foto Anggelina Rebecca Elsa Sendow"
											fill
											className="object-cover"
										/>
									</div>
									<div className="md:w-2/3 p-6 sm:p-8 flex flex-col justify-center">
										<h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
											Anggelina Rebecca Elsa Sendow, S.Psi.
										</h3>
										<p className="text-teal-600 font-medium mb-3 sm:mb-4">
											Pendiri RuangPena
										</p>
										<p className="text-base text-gray-600">
											Mahasiswi Magister Psikologi di Universitas 17 Agustus 1945
											Surabaya dengan hasrat untuk menciptakan solusi digital yang
											mendukung kesehatan mental dan pengembangan diri.
										</p>
									</div>
								</div>
							</Card>
						</AnimatedSection>
					</div>

					<p className="section-description text-center text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4 mb-16 sm:mb-20">
						RuangPena lahir dari keyakinan bahwa setiap orang berhak memiliki ruang
						yang aman untuk mengekspresikan pikiran dan perasaan mereka. Kami
						berkomitmen untuk menyediakan platform yang mendukung kesehatan mental
						dan pertumbuhan pribadi melalui praktik jurnal yang penuh kesadaran.
					</p>

					{/* About Features Grid with staggered animations */}
					<div className="about-features-grid grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
						{aboutFeatures.map((feature, index) => (
							<AnimatedSection key={index} delay={index * 200}>
								<article
									className="about-feature-card group"
									aria-labelledby={`about-feature-${index}-title`}
								>
									<Card className="h-full border-0 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group-hover:scale-105">
										<CardContent className="card-content p-6 sm:p-8 text-center h-full flex flex-col">
											<div className="feature-icon w-12 h-12 sm:w-16 sm:h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-300 group-hover:bg-teal-200 group-hover:scale-110">
												<feature.icon
													className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600 transition-all duration-300 group-hover:text-teal-700"
													aria-hidden="true"
												/>
											</div>
											<h3
												id={`about-feature-${index}-title`}
												className="feature-title text-lg sm:text-xl font-medium text-gray-900 mb-3 sm:mb-4 transition-colors duration-300 group-hover:text-teal-700"
											>
												{feature.title}
											</h3>
											<p className="feature-description text-sm sm:text-base text-gray-600 leading-relaxed flex-grow">
												{feature.description}
											</p>
										</CardContent>
									</Card>
								</article>
							</AnimatedSection>
						))}
					</div>
				</div>
			</section>
		</AnimatedSection>
	)
}
