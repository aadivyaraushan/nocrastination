import { StyleSheet, View, Text, Image } from "react-native";
import Coin from ".././assets/coin.png";

function Topbar()
{
	return (
		<View style={styles.header}>
			<View style={styles.levels}>
				<View style={styles.level}>
					<Text style={styles.levelText}>1</Text>
				</View>
				<View style={styles.progress}>
					<Text style={styles.progressText}>10/100</Text>
				</View>
			</View>
			<View style={styles.diamonds}>
				<Image style={styles.icon} resizeMode={"contain"} source={require(".././assets/ruby.png")} />
				<Text style={styles.iconText}>0</Text>
			</View>
			<View style={styles.diamonds}>
				<Image style={styles.icon} resizeMode={"contain"} source={require(".././assets/coin.png")} />
				<Text style={styles.iconText}>0</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		width: "100%",
		height: 50,
		flexDirection: "row",
		justifyContent: "space-evenly",
		backgroundColor: "#1F2025"
	},
	level: {
		backgroundColor: "#20A4A4",
		height: 40,
		width: 40,
		flex: 0.3,
		padding: 0
	},
	levelText: {
		color: "white",
		fontSize: 30,	
		padding: 0,
		width: 40,
		height: 40,
		textAlign: "center",
		marginVertical: "auto"
	},
	levels: {
		display: "flex",
		flexDirection: "row",
		flex: 1,
		alignItems: "center",
		marginLeft: 15
	},
	diamonds: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		flex: 1
	},
	progress: {
		flex: 0.5,
		backgroundColor: "#67CACA"	
	},
	progressText: {
		color: "white",
		textAlign: "center",
		padding: 0,
		fontSize: 20
	},
	icon: {
		width: 30,
		height: 30
	},
	iconText: {
		color: "white"
	}
});

export default Topbar;
