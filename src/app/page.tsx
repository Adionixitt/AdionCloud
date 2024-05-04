import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
	return (
		<main className="flex w-full min-h-screen flex-row justify-between">
			<div className="flex w-1/2 h-screen">

			</div>
			<div className="flex w-1/2 h-screen justify-center align-center flex-col">
				<div className="w-full h-1/2">
					<img className="w-full h-full object-cover" src="https://media.architecturaldigest.com/photos/5c9e699c1aeb991ed9e6da2b/16:9/w_2560%2Cc_limit/GettyImages-183996236.jpg"></img>
				</div>
				<div className="w-full h-1/2">
					<img className="w-full h-full object-cover" src="https://www.insidehook.com/wp-content/uploads/2023/07/Helsinki.jpg?fit=1200%2C800"></img>
				</div>
			</div>
		</main>
	);
}
