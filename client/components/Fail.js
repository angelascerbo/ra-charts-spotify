import React from 'react';

const Fail = ({ errorMsg }) => (
	<div>
		<h2>An Error Occured</h2>
		<p>{errorMsg}</p>
	</div>
);

export default Fail;