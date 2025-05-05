const GroupCards = () => {
  <div className="flex">
    <img className="w-40 h-40" />
    <div className="flex flex-col">
      <p className="text-2xl font-semibold text-nileBlue-700"> Group Admin </p>
      <div className="flex">
        <p>owner</p>
        <p>user</p>
      </div>
      <div className="flex">
        <p>created</p>
        <p>date</p>
        <p>last update</p>
        <p>abcdef</p>
      </div>
    </div>
    <button>leave group</button>
  </div>;
};

export default GroupCards;
