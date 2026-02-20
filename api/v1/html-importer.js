import axios from 'axios';

/**
 * HTML Importer Endpoint
 *
 * POST /v1/html-importer
 *
 * Purpose: Convert predefined sample HTML newsletter to Beefree-compatible JSON
 *
 * Security:
 * - Only converts hardcoded sample HTML (no arbitrary HTML conversion)
 * - Request body is ignored to prevent API abuse
 * - Prevents unauthorized use of paid HTML-to-JSON service
 *
 * Environment Variables Required:
 *   - HTML_IMPORTER_API_KEY
 *
 * External API: https://api.getbee.io/v1/conversion/html-to-json
 * Content-Type: text/html (NOT application/json!)
 */

/**
 * Hardcoded Sample HTML Newsletter
 * This is the ONLY HTML that can be converted via this endpoint
 * Any HTML sent from the frontend is ignored
 */
const SAMPLE_NEWSLETTER_HTML = `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
	<title>Beefree SDK Newsletter</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap" rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" type="text/css">
	<style>
		* {
			box-sizing: border-box;
		}
		body {
			margin: 0;
			padding: 0;
		}
		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}
		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}
		p {
			line-height: inherit
		}
		.button:hover {
			background-color: #8052ff !important;
			color: #ffffff !important;
		}
		@media (max-width:620px) {
			.row-content {
				width: 100% !important;
			}
			.stack .column {
				width: 100%;
				display: block;
			}
		}
	</style>
</head>
<body class="body" style="background-color: #fbf9ff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbf9ff;">
		<tbody>
			<tr>
				<td>
					<!-- Header Section -->
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 40px; padding-left: 25px; padding-right: 25px; padding-top: 30px; vertical-align: middle;">
													<div style="text-align: center; margin-bottom: 40px;">
														<h1 style="color: #7747ff; font-family: 'Urbanist','Arial'; font-size: 28px; font-weight: 700; margin: 0;">Beefree SDK</h1>
													</div>
													<div style="color:#7747ff;font-family:'Urbanist','Arial';font-size:20px;font-weight:600;letter-spacing:0px;line-height:1.5;text-align:left;">
														<p style="margin: 0;">Hey folks,&nbsp;</p>
													</div>
													<div style="color:#272d3d;font-family:'Inter','Arial';font-size:16px;font-weight:400;letter-spacing:0px;line-height:1.5;text-align:left;">
														<p style="margin: 16px 0;">Welcome to your October check in for developers building with the Beefree SDK. My goal with this newsletter is simple: give you the tools to ship faster with Beefree SDK while keeping you updated with the tips and insights that are worth your time.</p>
														<p style="margin: 16px 0;">Each month, we round up what's new, useful, and worth your time: one runnable Beefree SDK recipe, one big industry story, one video tutorial, and a changelog highlight.</p>
														<p style="margin: 16px 0 0 0;">Let's dig in.</p>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- Recipe Section -->
					<table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border: 1px solid #e4daff; border-radius: 15px 15px 0 0; color: #000000; width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 30px 25px; vertical-align: top;">
													<h2 style="margin: 0 0 10px 0; color: #26045d; font-family: 'Urbanist','Arial'; font-size: 35px; font-weight: 600; text-align: center;">Recipe of the month</h2>
													<h3 style="margin: 0; color: #7747ff; font-family: 'Urbanist','Arial'; font-size: 18px; font-weight: 600; text-align: center; line-height: 1.5;">Create a library of pre-built forms for your users' landing pages</h3>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>


					<!-- Recipe Content -->
					<table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #26045d; border-radius: 0 0 16px 16px; color: #000000; width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 30px; vertical-align: top;">
													<div style="color:#ffffff;font-family:'Inter','Arial';font-size:16px;font-weight:400;line-height:1.5;text-align:left;">
														<p style="margin: 0; margin-bottom: 16px;">Build a reusable form library your users can drop into any project.</p>
														<p style="margin: 0; margin-bottom: 16px;">This recipe walks through adding fields, managing schema, and organizing components for quick setup and consistent layouts.</p>
														<p style="margin: 0;">It is perfect for apps that need flexible form workflows inside the builder.</p>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- CTA Button -->
					<table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 30px 0; vertical-align: top;">
													<div style="text-align: center; padding: 20px;">
														<a href="https://docs.beefree.io/beefree-sdk/resources/cookbook/create-a-form-library-in-beefree-sdk" target="_blank" style="background-color: #7747ff; border-radius: 4px; color: #ffffff; display: inline-block; font-family: 'Inter','Arial'; font-size: 18px; font-weight: 400; padding: 12px 30px; text-decoration: none;">Get cooking</a>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- Industry News Section -->
					<table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border: 1px solid #e4daff; border-radius: 15px 15px 0 0; color: #000000; width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 30px 25px 10px; vertical-align: top;">
													<h2 style="margin: 0 0 10px 0; color: #26045d; font-family: 'Urbanist','Arial'; font-size: 25px; font-weight: 600;">📰 Industry news we're keeping an eye on</h2>
													<h3 style="margin: 0; color: #7747ff; font-family: 'Urbanist','Arial'; font-size: 20px; font-weight: 600; line-height: 1.2;">Inside the breach that broke the internet: the untold story of Log4Shell</h3>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- Industry News Content -->
					<table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-bottom: 8px solid #e4daff; border-left: 1px solid #e4daff; border-radius: 0 0 15px 15px; border-right: 8px solid #e4daff; color: #000000; width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 10px 25px 30px; vertical-align: top;">
													<div style="color:#272d3d;font-family:'Inter','Arial';font-size:16px;font-weight:400;line-height:1.5;text-align:left;">
														<p style="margin: 0; margin-bottom: 16px;">No, I'm not here to talk about the AWS outage. The <strong>Log4Shell</strong> vulnerability happened four years ago, but it's still one of the best reminders of how fragile open source can be. A single flaw in a widely used library caused ripple effects across the internet and showed how much we all depend on code maintained by small teams or even solo devs.</p>
														<p style="margin: 0; margin-bottom: 16px;"><strong>GitHub</strong>'s postmortem is worth a read. It breaks down what went wrong and the lessons that still hold up for anyone building with open source today.</p>
														<p style="margin: 0; margin-bottom: 16px;">At Beefree, we think about that a lot too. Scaling the SDK safely means building with resilience, testing early, and yes, keeping backups on top of backups.</p>
													</div>
													<div style="text-align: left; margin-top: 20px;">
														<a href="https://github.blog/open-source/inside-the-breach-that-broke-the-internet-the-untold-story-of-log4shell/" target="_blank" style="color: #7747ff; font-family: 'Inter','Arial'; font-size: 18px; text-decoration: none; border-bottom: 1px solid #7747ff; padding-bottom: 4px;">Read more &gt;</a>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- Spacer -->
					<table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="padding: 30px 0;">
													<div style="height:1px;"></div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- Video Section -->
					<table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border: 1px solid #e4daff; border-radius: 15px 15px 0 0; color: #000000; width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 30px 25px 10px; vertical-align: top;">
													<h2 style="margin: 0 0 10px 0; color: #26045d; font-family: 'Urbanist','Arial'; font-size: 25px; font-weight: 600;">📺 Useful videos</h2>
													<h3 style="margin: 0; color: #7747ff; font-family: 'Urbanist','Arial'; font-size: 20px; font-weight: 600; line-height: 1.2;">Add quality (and accessibility) checks right into your platform</h3>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- Video Content -->
					<table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-bottom: 8px solid #e4daff; border-left: 1px solid #e4daff; border-radius: 0 0 15px 15px; border-right: 8px solid #e4daff; color: #000000; width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 10px 25px 30px; vertical-align: top;">
													<div style="color:#272d3d;font-family:'Inter','Arial';font-size:16px;font-weight:400;line-height:1.5;text-align:left;">
														<p style="margin: 0; margin-bottom: 16px;">This walkthrough shows how to integrate QA checks straight into your editor so your users catch problems <em>before</em> publishing. It covers using the Check API to scan content and flag issues like missing links or alt text, or oversized images, then using Frontend Commands to take users directly to the fix.</p>
														<p style="margin: 0; margin-bottom: 16px;">It's a simple way to boost user satisfaction by helping them create accessible, high-quality output. Plus, we'll have more accessibility checks coming soon! Stay tuned.</p>
													</div>
													<div style="text-align: left; margin-top: 20px;">
														<a href="https://www.youtube.com/watch?v=L0SI9GOmw0M" target="_blank" style="color: #7747ff; font-family: 'Inter','Arial'; font-size: 18px; text-decoration: none; border-bottom: 1px solid #7747ff; padding-bottom: 4px;">Watch the video &gt;</a>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- Spacer -->
					<table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="padding: 30px 0;">
													<div style="height:1px;"></div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- Changelog Section -->
					<table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border: 1px solid #e4daff; border-radius: 15px 15px 0 0; color: #000000; width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 30px 25px 10px; vertical-align: top;">
													<h2 style="margin: 0; color: #26045d; font-family: 'Urbanist','Arial'; font-size: 25px; font-weight: 600;">📋 Changelog highlights</h2>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- Changelog Content -->
					<table class="row row-14" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; border-bottom: 8px solid #e4daff; border-left: 1px solid #e4daff; border-radius: 0 0 15px 15px; border-right: 8px solid #e4daff; color: #000000; width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 10px 25px 30px; vertical-align: top;">
													<div style="color:#272d3d;font-family:'Inter','Arial';font-size:16px;font-weight:400;line-height:1.5;text-align:left;">
														<p style="margin: 0; margin-bottom: 16px;">Based on your feedback, we're always improving the Beefree SDK, and here's the latest update I'm most excited about:</p>
													</div>
													<div style="color:#26045d;font-family:'Inter','Arial';font-size:16px;font-weight:400;line-height:1.5;text-align:left;">
														<p style="margin: 0;"><strong>Custom AddOns: Direct open on drop</strong></p>
													</div>
													<div style="color:#272d3d;font-family:'Inter','Arial';font-size:16px;font-weight:400;line-height:1.5;text-align:left;">
														<p style="margin: 16px 0;">AddOns can now open instantly when dropped onto the stage. You can show content right away or open a dialog for configuration. One less click = a smoother experience.</p>
														<p style="margin: 0 0 16px 0;">We also fixed a few things:</p>
														<ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
															<li><strong>Plain text API</strong>: Custom HTML now converts correctly.</li>
															<li><strong>File manager</strong>: Advanced Permissions updates via <em>bee.loadConfig()</em> now apply.</li>
															<li><strong>Simple schema</strong>: Images keep the right size.</li>
															<li><strong>Form block preview</strong>: Forms now show when AMP is enabled.</li>
															<li><strong>Callbacks</strong>: <em>onPreview</em> and <em>onTogglePreview</em> now behave consistently.</li>
														</ul>
														<p style="margin: 16px 0 0 0;">Finally, we've updated Beefree's Default Theme with higher-contrast colors that meet WCAG AA standards. Accessibility and usability are both better than ever!</p>
													</div>
													<div style="text-align: left; margin-top: 20px;">
														<a href="https://app.getbeamer.com/developersbeefreeio/" target="_blank" style="color: #7747ff; font-family: 'Inter','Arial'; font-size: 18px; text-decoration: none; border-bottom: 1px solid #7747ff; padding-bottom: 4px;">Read more &gt;</a>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- Closing Section -->
					<table class="row row-15" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 30px 25px; vertical-align: middle;">
													<div style="color:#272d3d;font-family:'Inter','Arial';font-size:16px;font-weight:400;line-height:1.5;text-align:left;">
														<p style="margin: 0; margin-bottom: 16px;">That's a wrap for October. Dive into the recipe, catch the video, and explore the new SDK updates.</p>
														<p style="margin: 0;">Have feedback or a build you're proud of? Hit reply and share it. I read every note and always enjoy seeing how you're using <strong>Beefree SDK</strong> out in the wild.</p>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- Signature -->
					<table class="row row-16" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 25px; vertical-align: bottom;">
													<div style="color:#26045d;font-family:'Urbanist','Arial';font-size:22px;font-weight:400;line-height:1.5;text-align:left;">
														<p style="margin: 0;"><strong>Lawrence Lockhart</strong></p>
													</div>
													<div style="color:#272d3d;font-family:'Urbanist','Arial';font-size:18px;font-weight:600;line-height:1.5;text-align:left;">
														<p style="margin: 0;"><a href="https://www.linkedin.com/in/lawrencelockhart/" target="_blank" style="text-decoration: none; color: #7747ff;" rel="noopener">Senior Developer Advocate, Beefree</a></p>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- Footer -->
					<table class="row row-18" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbf9ff;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbf9ff; border-radius: 0; color: #000000; width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 40px 25px;">
													<div style="color:#26045d;font-family:'Inter','Arial';font-size:13px;font-weight:700;line-height:1.5;text-align:left;">
														<p style="margin: 0;"><strong>The embeddable content creation toolkit for SaaS.</strong></p>
													</div>
													<div style="color:#444a5b;font-family:'Inter','Arial';font-size:10px;font-weight:400;line-height:1.8;text-align:left; margin-top: 20px;">
														<p style="margin: 0 0 10px 0;">You received this message because you signed up at a booth, recently talked with someone at our team, or registered to try the Beefree SDK. If you no longer wish to receive our messages you can <a href="#" style="text-decoration: underline; color: #444a5b;">unsubscribe</a>.</p>
														<p style="margin: 0;"><a href="#" style="text-decoration: underline; color: #444a5b;">View in browser.</a></p>
													</div>
													<div style="color:#444a5b;font-family:'Inter','Arial';font-size:10px;font-weight:400;line-height:1.8;text-align:left; margin-top: 10px;">
														<p style="margin: 0;"><a href="https://developers.beefree.io/blog" target="_blank" style="text-decoration: none; color: #7747ff;">Read our blog</a> | <a href="https://academy.beefree.io/" target="_blank" style="text-decoration: none; color: #7747ff;">Beefree Academy</a> | <a href="https://developers.beefree.io/" target="_blank" style="text-decoration: none; color: #7747ff;">developers.beefree.io</a></p>
													</div>
													<div style="color:#444a5b;font-family:'Inter','Arial';font-size:10px;font-weight:400;line-height:1.8;text-align:left; margin-top: 5px;">
														<p style="margin: 0;"><a href="http://developers.beefree.io/privacy-policy" target="_blank" style="text-decoration: none; color: #444a5b;">Privacy Policy</a> | <a href="http://developers.beefree.io/gdpr" target="_blank" style="text-decoration: none; color: #444a5b;">GDPR</a> | <a href="https://developers.beefree.io/terms-of-service" target="_blank" style="text-decoration: none; color: #444a5b;">Terms of Service</a> | <a href="https://devportal.beefree.io/hc/en-us/requests/new" target="_blank" title="Get in touch" style="text-decoration: none; color: #444a5b;">Drop us a line</a></p>
													</div>
													<div style="color:#444a5b;font-family:'Inter','Arial';font-size:10px;font-weight:400;line-height:1.8;text-align:left; margin-top: 5px;">
														<p style="margin: 0;"><strong>©Bee Content Design, Inc.</strong>&nbsp;San Francisco, CA | Part of <a href="https://www.growens.io/en/" target="_blank" style="text-decoration: underline; color: #444a5b;">Growens</a></p>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

					<!-- Designed with Beefree -->
					<table class="row row-19" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbf9ff;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbf9ff; border-radius: 0; color: #000000; width: 600px; margin: 0 auto;" width="600">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 20px 25px 50px; vertical-align: top;">
													<div style="text-align: center; border-top: 1px solid #E4DAFF; padding-top: 20px;">
														<p style="margin: 0; font-family: 'Inter','Arial'; font-size: 14px; color: #7747ff;"><a href="https://beefree.io/" target="_self" style="color: #7747ff; text-decoration: none;">🐝 Designed with Beefree</a></p>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

				</td>
			</tr>
		</tbody>
	</table>
</body>
</html>`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const HTML_IMPORTER_API_KEY = process.env.HTML_IMPORTER_API_KEY;
    const HTML_IMPORTER_URL = 'https://api.getbee.io/v1/conversion/html-to-json';

    if (!HTML_IMPORTER_API_KEY) {
      return res.status(500).json({ error: 'HTML Importer API Key not configured' });
    }

    // SECURITY: Ignore any HTML from request body
    // Only convert the hardcoded sample HTML to prevent API abuse
    // Call Beefree HTML Importer API with hardcoded HTML
    const response = await axios.post(
      HTML_IMPORTER_URL,
      SAMPLE_NEWSLETTER_HTML,
      {
        headers: {
          'Authorization': `Bearer ${HTML_IMPORTER_API_KEY}`,
          'Content-Type': 'text/html'
        },
        timeout: 15000,
        maxContentLength: 5 * 1024 * 1024,
        maxBodyLength: 5 * 1024 * 1024
      }
    );

    res.json(response.data);
  } catch (error) {
    const status = error.response?.status;
    const responseData = error.response?.data;
    console.error('HTML importer error:', {
      message: error.message,
      code: error.code,
      status,
      responseData,
    });
    if (status === 413) {
      res.status(413).json({ error: 'HTML content too large' });
    } else if (status === 422) {
      res.status(422).json({ error: 'Invalid HTML format. Please check the HTML content.' });
    } else if (error.code === 'ECONNABORTED') {
      res.status(408).json({ error: 'Request timeout - HTML processing took too long' });
    } else {
      res.status(500).json({ error: 'Failed to import HTML' });
    }
  }
}

