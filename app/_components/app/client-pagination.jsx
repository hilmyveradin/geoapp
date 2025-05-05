"use client";

import React, { useState, useEffect } from "react";
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
import useCardStore from "@/helpers/hooks/store/use-card-store";

export default function ClientPagination({ data, ...props }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(data.length);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const { cardDimension } = useCardStore();

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function calculatePostsPerPage() {
      const { width, height } = windowDimensions;

      if (width < 640) {
        setPostsPerPage(2); // Mobile: 2 posts per page
      } else if (width < 1024) {
        setPostsPerPage(4); // Tablet: 4 posts per page
      } else {
        // Desktop: Calculate based on screen size
        const gap = 16; // Gap between cards

        const columns = Math.floor((width - 40) / (cardDimension.width + gap)); // 40px for potential scrollbar and margins
        const rows = Math.floor((height - 200) / (cardDimension.height + gap)); // 200px for header, footer, pagination, etc.

        const calculatedPosts = columns * rows;
        setPostsPerPage(calculatedPosts);
      }
    }

    calculatePostsPerPage();
  }, [windowDimensions]);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = data.slice(firstPostIndex, lastPostIndex);

  const showPagination = data.length > postsPerPage;

  return (
    <>
      {currentPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {currentPosts.map((currentPost) => (
              <MenuCard key={currentPost.cardUid} cardData={currentPost} />
            ))}
          </div>
          {showPagination && (
            <div className="my-6">
              <PaginationSection
                totalPosts={data.length}
                postsPerPage={postsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                windowWidth={windowDimensions.width}
              />
            </div>
          )}
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
  windowWidth,
}) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const maxPageNum = windowWidth < 640 ? 3 : 5; // Show fewer page numbers on mobile
  const pageNumLimit = Math.floor(maxPageNum / 2);

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

  const renderPages = () => {
    const renderedPages = activePages.map((page, idx) => (
      <PaginationItem
        key={idx}
        className={
          currentPage === page
            ? "bg-nileBlue-700 rounded-md cursor-pointer text-white"
            : ""
        }
      >
        <PaginationLink
          onClick={() => setCurrentPage(page)}
          className="hover:bg-nileBlue-300"
        >
          {page}
        </PaginationLink>
      </PaginationItem>
    ));

    if (activePages[0] > 1) {
      renderedPages.unshift(
        <PaginationEllipsis
          key="ellipsis-start"
          onClick={() => setCurrentPage(activePages[0] - 1)}
          className="rounded-md hover:bg-nileBlue-300"
        />
      );
    }

    if (activePages[activePages.length - 1] < pageNumbers.length) {
      renderedPages.push(
        <PaginationEllipsis
          key="ellipsis-end"
          onClick={() =>
            setCurrentPage(activePages[activePages.length - 1] + 1)
          }
          className="rounded-md hover:bg-nileBlue-300"
        />
      );
    }

    return renderedPages;
  };

  return (
    <div>
      <Pagination>
        <PaginationContent className="flex-wrap justify-center">
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
