import * as React from 'react';

export interface TheadProps {
    titles: string[];
    [index: string]: any;
}

export default class Thead extends React.Component<TheadProps> {
    render() {
        const {titles} = this.props;
        return (
            <thead>
                <tr>
                    {
                        titles.map(e => {
                            return (
                                <td>{e}</td>
                            )
                        })
                    }
                </tr>
            </thead>
        )
    }
}