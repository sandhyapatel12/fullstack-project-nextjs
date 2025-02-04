"use client"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { GiNextButton, GiPreviousButton } from 'react-icons/gi';

// Type definition for the component props
interface PaginationProps {
  count: number; // The total number of items
  limit: number; // Ensure this property is defined
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ count }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const page = parseInt(searchParams.get("page") || "1");

  const ITEM_PER_PAGE = 10;
  const totalPages = Math.ceil(count / ITEM_PER_PAGE);

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  // Helper function to change the page via URL params
  const navigateToPage = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", newPage.toString());
    replace(`${pathname}?${newSearchParams.toString()}`);

  };

  return (
    <div className=" flex justify-between items-center ">

      {/* Previous Button */}
      <div>
        {hasPrev && (
          <button
            onClick={() => navigateToPage(page - 1)}
            className="bg-[#6aa84f] py-1 text-xs md:py-2 px-2 md:px-5 w-fit rounded-md shadow-lg text-white flex justify-center items-center hover:bg-[#38761d]"
          >
            <GiPreviousButton />
          </button>
        )}
      </div>

      {/* Current Page */}
      <div>
        <span className="text-gray-800 font-bold text-xs md:text-sm ">
          Page {page} of {totalPages}
        </span>
      </div>

      {/* Next Button */}
      <div>
        {hasNext && (
          <button
            onClick={() => navigateToPage(page + 1)}
            className="bg-[#6aa84f] py-1 text-xs md:py-2 px-2 md:px-5 w-fit rounded-md shadow-lg text-white flex justify-center items-center hover:bg-[#38761d]"
          >
            <GiNextButton />
          </button>
        )}
      </div>

    </div>
  );
};

export default Pagination;
