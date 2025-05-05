"use client";

import React, { useState } from "react";
import MenuCard from "@/app/_components/app/menu-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ClientPagination({ data, ...props }) {
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 6;
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = data.slice(firstPostIndex, lastPostIndex);

  return (
    <>
      {" "}
      {currentPosts.length > 0 ? (
        <>
          <div class="sm:grid grid-cols-3 grid-rows-2 gap-x-4 gap-y-6 flex flex-col">
            {currentPosts.map((currentPost) => {
              return (
                <MenuCard
                  key={currentPost.cardUid}
                  cardData={currentPost}
                  // layerUid={currentPosts.layerUid}
                  // source={currentPosts.thumbnailUrl}
                  // title={currentPosts.cardTitle}
                  // user={currentPosts.creator}
                />
              );
            })}
          </div>
          <div className="my-6">
            <PaginationSection
              totalPosts={data.length}
              postsPerPage={postsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </>
      ) : (
        <div className="grid w-full gap-10 p-10 sm:grid-cols-2 md:grid-cols-3"></div>
      )}
    </>
  );
}

function PaginationSection({
  totalPosts,
  postsPerPage,
  currentPage,
  setCurrentPage,
}) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const maxPageNum = 5; // Maximum page numbers to display at once
  const pageNumLimit = Math.floor(maxPageNum / 2); // Current page should be in the middle if possible

  let activePages = pageNumbers.slice(
    Math.max(0, currentPage - 1 - pageNumLimit),
    Math.min(currentPage - 1 + pageNumLimit + 1, pageNumbers.length)
  );

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to render page numbers with ellipsis
  const renderPages = () => {
    const renderedPages = activePages.map((page, idx) => (
      <PaginationItem
        key={idx}
        className={
          currentPage === page ? "bg-nileBlue-700 rounded-md cursor-pointer" : ""
        }
      >
        <PaginationLink 
          onClick={() => setCurrentPage(page)}
          className="hover:bg-nileBlue-300">
          {page}
        </PaginationLink>
      </PaginationItem>
    ));

    // Add ellipsis at the start if necessary
    if (activePages[0] > 1) {
      renderedPages.unshift(
        <PaginationEllipsis
          key="ellipsis-start"
          onClick={() => setCurrentPage(activePages[0] - 1)}
          className="hover:bg-nileBlue-300 rounded-md"
        />
      );
    }

    // Add ellipsis at the end if necessary
    if (activePages[activePages.length - 1] < pageNumbers.length) {
      renderedPages.push(
        <PaginationEllipsis
          key="ellipsis-end"
          onClick={() =>
            setCurrentPage(activePages[activePages.length - 1] + 1)
          }
          className="hover:bg-nileBlue-300 rounded-md"
        />
      );
    }

    return renderedPages;
  };
  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={handlePrevPage}
              className="hover:bg-nileBlue-300" 
            />
          </PaginationItem>

          {renderPages()}

          <PaginationItem>
            <PaginationNext 
              onClick={handleNextPage}
              className="hover:bg-nileBlue-300" 
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
