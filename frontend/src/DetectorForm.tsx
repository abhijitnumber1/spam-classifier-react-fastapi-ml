import axios from "axios";
import { useState } from "react";
const apiBase = import.meta.env.VITE_DOMAIN_NAME || "http://localhost:8000";

const DetectorForm = () => {
	const [message, setmessage] = useState<string>("");
	const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
	const [prediction, setprediction] = useState<boolean>(false);
	const [responseStatus, setResponseStatus] = useState<number | null>(null);
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setmessage(value);
		if (typingTimeout) {
			clearTimeout(typingTimeout);
		}
		if (value.length > 10) {
			const timeout = setTimeout(() => {
				apiCall({ request_data: { clasification_text: value } });
			}, 500);
			setTypingTimeout(timeout);
		}
	};
	const apiCall = async ({
		request_data,
	}: {
		request_data: {
			clasification_text: string;
		};
	}) => {
		try {
			console.log(request_data);
			const response = await axios.post(
				apiBase + "/clasify",
				request_data
			);

			if (response.data.prediction == 1) {
				setprediction(true);
			} else {
				setprediction(false);
			}
		} catch (err) {
			const error = err as any;
			console.log(error);

			const status = error.response?.status;

			if (status === 429) {
				setResponseStatus(429);
			} else {
				setResponseStatus(status || 500);
			}
		}
	};
	return (
		<div className="container mt-5">
			<form className="row g-3">
				<div className="mb-3">
					<label htmlFor="comment" className="form-label">
						Type your message:
					</label>
					<textarea
						className={
							prediction
								? "form-control is-invalid"
								: "form-control"
						}
						id="comment"
						rows={4}
						value={message}
						onChange={handleChange}
					></textarea>
					{prediction && (
						<div className="alert alert-danger mt-3" role="alert">
							This is a Spam Message
						</div>
					)}
					{responseStatus == 429 && (
						<div className="alert alert-warning" role="alert">
							Too many request. Try after sometimes.
						</div>
					)}
				</div>
			</form>
		</div>
	);
};

export default DetectorForm;
