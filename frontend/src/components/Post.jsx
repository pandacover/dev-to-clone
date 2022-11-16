import React from "react";
import propTypes from "prop-types";
import {
	Card,
	Box,
	Avatar,
	Typography,
	CardContent,
	CardMedia,
	CardActions,
	Button,
} from "@mui/material";
import { ThumbUpAltOutlined } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

const Post = ({ info }) => {
	const date = `${new Date(info.createdAt).toLocaleDateString()} (${new Date(
		info.createdAt
	).toLocaleTimeString()})`;
	const { token } = React.useContext(AuthContext);
	const [user, setUser] = React.useState({});
	const [likes, setLikes] = React.useState(info.likes.length);
	const [liked, setLiked] = React.useState(0);

	React.useEffect(() => {
		async function fetchUser() {
			const response = await fetch(`/api/users/${info.owner}`, {
				method: "GET",
				headers: {
					Authorization: "Bearer " + token,
				},
			});

			response.json().then((data) => {
				if (response.ok) {
					setUser(data.findUser);
					setLiked(
						info.likes.filter((item) => String(item) === data.findUser._id)
							.length === 1
					);
				}
			});
		}

		fetchUser();
		// eslint-disable-next-line
	}, [info.owner]);

	const addLikeHandler = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch("/api/posts/like/" + info._id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
			});

			response.json().then((data) => {
				if (response.ok) {
					console.log(data.message);
					if (liked) {
						setLikes(likes - 1);
						setLiked(false);
					} else {
						setLikes(likes + 1);
						setLiked(true);
					}
				} else {
					console.error(data.message);
				}
			});
		} catch (error) {
			console.error(error.message);
		}
	};

	return (
		<Card
			variant='outlined'
			sx={{
				margin: "0 auto",
				backgroundColor: "#fff",
				borderRadius: 2,
				boxShadow: 1,
				marginBottom: 2,
				width: "650px",
			}}
		>
			{info.coverPhoto && (
				<CardMedia
					component='img'
					height='273'
					image={info.coverPhoto}
					alt={info.title}
				/>
			)}
			<Box
				marginBottom={2}
				marginTop={2}
				sx={{
					padding: "0 30px",
					display: "flex",
					alignItems: "center",
				}}
			>
				<Avatar alt='user' src={user.avatar} />
				<Box sx={{ display: "flex", flexDirection: "column" }} marginLeft={1}>
					<Typography component='span' sx={{ fontWeight: "bold" }}>
						<NavLink className='post__userName-href' to={"/user/" + user._id}>
							{user.name}
						</NavLink>
					</Typography>
					<Typography
						component='span'
						sx={{ fontSize: "13px", color: "gray", padding: "2px" }}
					>
						{date}
					</Typography>
				</Box>
			</Box>
			<CardContent sx={{ padding: "0 50px" }}>
				<Box>
					<Typography
						variant='h5'
						component='div'
						sx={{ fontSize: "25px", fontWeight: "bold" }}
					>
						<NavLink className='post__title-href' to={"/post/" + info._id}>
							{info.title}
						</NavLink>
					</Typography>
				</Box>

				<Box
					sx={{
						width: "100%",
						display: "flex",
						marginTop: 1,
					}}
				>
					{info.tags.map((tag, index) => {
						return (
							<Typography
								component='span'
								className='post__tags-item'
								key={tag + index}
								sx={{ fontSize: "14px", color: "grey", padding: "2px" }}
							>
								#{tag}
							</Typography>
						);
					})}
				</Box>
			</CardContent>
			<CardActions sx={{ marginTop: 1, padding: "0 50px 20px" }}>
				<Button
					size='small'
					sx={{ width: "175px" }}
					onClick={addLikeHandler}
					style={{ cursor: "pointer" }}
				>
					<Typography
						component='span'
						sx={{
							display: "flex",
							alignItems: "center",
							width: "100%",
							gap: "2em",
							color: "#000",
						}}
					>
						<ThumbUpAltOutlined />
						<Typography component='span' margin={"0 10px 0"}>
							{likes}
						</Typography>
					</Typography>
				</Button>

				{/* <Button size='small' sx={{ width: "280px", marginLeft: 2 }}>
					<Typography
						component='span'
						sx={{
							display: "flex",
							alignItems: "center",
							width: "100%",
							justifyContent: "space-between",
							color: "#000",
						}}
					>
						<ChatBubbleOutlineOutlined />
						<Typography component='span' margin={"0 10px 0"}>
							{info.likes}
						</Typography>
						Add a comment
					</Typography>
				</Button> */}
			</CardActions>
		</Card>
	);
};

Post.propTypes = {
	info: propTypes.object.isRequired,
};

export default Post;
