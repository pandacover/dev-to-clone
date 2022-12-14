import React from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";

const NewPost = () => {
	const postId = useParams().id;
	const [post, setPost] = React.useState({});
	const { token } = React.useContext(AuthContext);
	const coverRef = React.useRef();
	const [messageInfo, setMessageInfo] = React.useState({
		text: "",
		type: "",
	});
	const [info, setInfo] = React.useState({
		title: "",
		description: "",
		coverPhoto: "",
		tags: [],
	});
	const [loading, setLoading] = React.useState(false);

	React.useEffect(() => {
		async function fetchPost() {
			const response = await fetch("/api/posts/" + postId, {
				method: "GET",
				headers: {
					Authorization: "Bearer " + token,
				},
			});

			response.json().then((data) => {
				if (response.ok) {
					setPost(data);
					setInfo(data);
				}
			});
		}

		fetchPost();
		// eslint-disable-next-line
	}, []);

	const changePostHandler = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/posts/change/" + post._id, {
				method: "PUT",
				body: JSON.stringify(info),
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
			});

			response.json().then((data) => {
				setLoading(false);
				if (response.ok) {
					setMessageInfo({
						text: data.message,
						type: "success",
					});
				} else {
					setMessageInfo({
						text: data.message,
						type: "error",
					});
				}
			});
		} catch (e) {
			setLoading(false);
			setMessageInfo({
				text: e.message,
				type: "error",
			});
		}
	};

	const addNewPostHandler = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/posts/add", {
				method: "POST",
				body: JSON.stringify(info),
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
			});

			response.json().then((data) => {
				setLoading(false);
				if (response.ok) {
					setMessageInfo({
						text: data.message,
						type: "success",
					});

					setInfo({
						title: "",
						description: "",
					});
				} else {
					setMessageInfo({
						text: data.message,
						type: "error",
					});
				}
			});
		} catch (e) {
			setLoading(false);
			setMessageInfo({
				text: e.message,
				type: "error",
			});
		}
	};

	const addCoverPhotoHandler = (event) => {
		setLoading(true);
		const file = Array.from(event.target.files)[0];
		const reader = new FileReader();
		const allowedTypes = ["jpg", "jpeg", "png", "gif"];

		if (!file) return;

		reader.readAsDataURL(file);

		reader.onload = () => {
			const result = reader.result;
			const type = file.name.split(".")[file.name.split(".").length - 1];
			setLoading(false);

			if (!allowedTypes.includes(type)) {
				return setMessageInfo({
					text: "A file of this type is not supported",
					type: "warning",
				});
			}

			setInfo({ ...info, coverPhoto: result });
		};

		reader.onerror = () => {
			setLoading(false);
			setMessageInfo({
				text: reader.error.message,
				type: "error",
			});
		};
	};

	return (
		<>
			{messageInfo.text && (
				<Alert sx={{ marginBottom: 1 }} severity={messageInfo.type}>
					{messageInfo.text}
				</Alert>
			)}
			<Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Box
						sx={{
							width: "75%",
						}}
					>
						<Box
							sx={{
								minHeight: "70vh",
								backgroundColor: "#fff",
								padding: "30px 40px",
								borderRadius: "6px",
								boxShadow: 1,
								marginBottom: 3,
							}}
						>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
								}}
							>
								<Box>
									{info.coverPhoto && (
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
											}}
										>
											<Box
												sx={{
													backgroundImage: "url(" + info.coverPhoto + ")",
													backgroundRepeat: "no-repeat",
													backgroundSize: "cover",
													backgroundPosition: "center",
													width: "250px",
													height: "105px",
													borderRadius: 3,
													marginRight: 2,
													marginBottom: 2,
												}}
											></Box>
											<Button
												variant='text'
												color='error'
												onClick={() => {
													setInfo({ ...info, coverPhoto: "" });
												}}
											>
												Delete
											</Button>
										</Box>
									)}

									<input
										type='file'
										style={{ display: "none" }}
										ref={coverRef}
										onChange={addCoverPhotoHandler}
										onClick={(event) => {
											event.target.value = null;
										}}
									/>
									<Button
										disabled={loading}
										variant='outlined'
										sx={{
											marginBottom: 3,
											maxWidth: "33%",
											color: "#000",
											border: "1px solid grey",
											boxShadow: 1,
										}}
										onClick={() => coverRef.current.click()}
									>
										Add a photo of the cover
									</Button>
								</Box>

								<TextField
									value={info.title}
									onChange={(event) =>
										setInfo({ ...info, title: event.target.value })
									}
									InputProps={{
										style: {
											fontFamily:
												"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif",
											fontSize: 40,
											fontWeight: "bold",
											marginBottom: 10,
										},
										disableUnderline: true,
									}}
									variant='standard'
									placeholder='The headline of the new post...'
									multiline
									rows={2}
								/>
								<TextField
									value={info.tags && info.tags.join(", ")}
									InputProps={{
										disableUnderline: true,
									}}
									variant='standard'
									placeholder='Add to 4 tags...'
									onChange={(event) => {
										setInfo({ ...info, tags: event.target.value.split(", ") });
									}}
								/>
							</Box>

							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
								}}
							>
								<TextField
									value={info.description}
									onChange={(event) =>
										setInfo({ ...info, description: event.target.value })
									}
									InputProps={{
										disableUnderline: true,
									}}
									variant='standard'
									placeholder='Write down the description of your post...'
									multiline
									rows='8'
								/>
							</Box>
						</Box>
						{!postId ? (
							<Button
								disabled={loading}
								variant='contained'
								onClick={addNewPostHandler}
							>
								Publish
							</Button>
						) : (
							<Button
								disabled={loading}
								variant='contained'
								onClick={changePostHandler}
							>
								Change
							</Button>
						)}
					</Box>
					<Box sx={{ marginLeft: 2, maxWidth: "25%" }}>
						<Typography variant='h6' component='div'>
							Fundamentals of the editor
						</Typography>
						<Typography variant='h7' component='span' marginTop={1}>
							Use text fields to write and format records. Markdown text is
							supported.You can also add the cover to the post.
						</Typography>
					</Box>
				</Box>
			</Box>
		</>
	);
};

export default NewPost;
