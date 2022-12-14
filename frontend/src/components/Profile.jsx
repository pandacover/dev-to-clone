import React from "react";
import propTypes from "prop-types";
import {
	Card,
	Box,
	Avatar,
	CardContent,
	Typography,
	Button,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Profile = ({ info }) => {
	const date = `${new Date(info.createdAt).toLocaleDateString()} (${new Date(
		info.createdAt
	).toLocaleTimeString()})`;
	const { userInfo } = React.useContext(AuthContext);

	return (
		<Card
			sx={{
				width: "25%",
				boxShadow: 1,
				borderRadius: 2,
				padding: "10px",
				position: "sticky",
				top: 80,
				right: 0,
			}}
		>
			<Box sx={{ marginBottom: 1, display: "flex", alignItems: "flex-end" }}>
				<Avatar
					alt={info.name}
					src={info.avatar}
					sx={{ width: 50, height: 50 }}
				/>
				<Typography variant='h6' component='div' sx={{ marginLeft: 1 }}>
					<NavLink to={"/user/" + info._id}>{info.name}</NavLink>
				</Typography>
			</Box>
			<CardContent>
				{info._id !== userInfo._id ? (
					<Button sx={{ marginBottom: 2, width: "100%" }} variant='contained'>
						Subscribe
					</Button>
				) : (
					<Button sx={{ marginBottom: 2, width: "100%" }} variant='contained'>
						<NavLink to={"/user/" + userInfo._id}>Go</NavLink>
					</Button>
				)}

				<Box
					sx={{
						marginBottom: 1,
					}}
				>
					<Typography component='span'>{info.bio}</Typography>
				</Box>
				<Box
					sx={{
						marginBottom: 1,
					}}
				>
					<Typography
						component='span'
						sx={{
							fontWeight: "bold",
							textTransform: "uppercase",
							color: "gray",
							fontSize: 14,
						}}
					>
						City
					</Typography>
					<Typography>{info.city}</Typography>
				</Box>
				<Box
					sx={{
						marginBottom: 1,
					}}
				>
					<Typography
						component='span'
						sx={{
							fontWeight: "bold",
							textTransform: "uppercase",
							color: "gray",
							fontSize: 14,
						}}
					>
						Work
					</Typography>
					<Typography>{info.work}</Typography>
				</Box>

				<Box>
					<Typography
						component='span'
						sx={{
							fontWeight: "bold",
							textTransform: "uppercase",
							color: "gray",
							fontSize: 14,
						}}
					>
						Registration
					</Typography>
					<Typography>{date}</Typography>
				</Box>
			</CardContent>
		</Card>
	);
};

Profile.propTypes = {
	info: propTypes.object.isRequired,
};

export default Profile;
