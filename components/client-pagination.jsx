"use client";

import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import Image from "next/image";

export default function ClientPagination({data, ...props}) {
	// Define image url since it is a public link
  // If we use fetch, there will be too many
  // Async handling, and the thumbnail image is public
  const IMAGE_BASE_URL = "http://dev3.webgis.co.id/be";

	return (
		<> {data.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{data.map((item,idx) => {
						return (
							<Card key={idx}>
								<Image 
									src={`${IMAGE_BASE_URL}/gs/thumbnail/${data[idx].thumbnail_url}`} 
									alt="" 
									width={300} 
									height={200} 
								/>
							</Card>
						);
					})}
				</div>
			) : (
				<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 w-full p-10"></div>
			)}
		</>
	);
}