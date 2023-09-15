import ForgeUI, { Button, ButtonSet } from '@forge/ui';

const getPages = (currentPage, pagesCount) => {
  const pages = [];
  pages.push(currentPage);
  if (currentPage != 1) pages.push(1);
  if (currentPage - 1 > 1) pages.push(currentPage - 1);
  if (currentPage - 2 > 1) pages.push(currentPage - 2);
  if (currentPage + 1 < pagesCount) pages.push(currentPage + 1);
  if (currentPage + 2 < pagesCount) pages.push(currentPage + 2);
  if (currentPage != pagesCount) pages.push(pagesCount);
  return [...new Set(pages)].sort((a, b) => a - b);
};

const Pagniation = ({ setPage, currentPage, totalCount, itemsPerPage }) => {
  const prevPage = () => setPage(currentPage - 1);
  const nextPage = () => setPage(currentPage + 1);

  const pagesCount = Math.ceil(totalCount / itemsPerPage);

  const pages = getPages(currentPage, pagesCount);

  return (
    <ButtonSet>
      <Button text='Prev' appearance='link' onClick={prevPage} />
      {pages.map((p) => (
        <Button text={p} appearance='link' onClick={() => setPage(p)} />
      ))}
      <Button text='Next' appearance='link' onClick={nextPage} />
    </ButtonSet>
  );
};

export default Pagniation;
