import classNames from 'classnames';
import Flex from 'components/common/Flex';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { GaugeChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { getColor } from 'helpers/utils';
import PropTypes from 'prop-types';

import { Card } from 'react-bootstrap';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  GaugeChart,
  CanvasRenderer,
  LegendComponent,
]);

const getOptions = (data) => ({
  series: [
    {
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      radius: '100%',
      pointer: {
        show: false,
      },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: {
          color: getColor('primary'),
        },
      },
      axisLine: {
        lineStyle: {
          width: 8,
          color: [[1, getColor('gray-200')]],
        },
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      data: [
        {
          value: data,
          detail: {
            offsetCenter: ['7%', '4%'],
          },
        },
      ],
      detail: {
        width: 50,
        height: 14,
        fontSize: 28,
        fontWeight: 500,
        fontFamily: 'poppins',
        color: getColor('gray-500'),
        formatter: '{value}%',
      },
    },
  ],
});

const ReportProgress = ({ bodyClassName, value, label, title }) => {
  return (
    <Card className="h-100">
      <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
        <div className="position-relative z-index-1 light">
          <h5 className="mb-0 text-white">{title}</h5>
        </div>
      </Card.Header>
      <Card.Body
        className={classNames(bodyClassName, 'h-100')}
        as={Flex}
        direction="column"
        alignItems="between"
      >
        <ReactEChartsCore
          echarts={echarts}
          option={getOptions(value)}
          style={{ height: '10.3rem', widht: '10.3rem' }}
        />
        <div className="text-center mt-3">
          <h6 className="fs-0 mb-1">{label}</h6>
        </div>
      </Card.Body>
      <Card.Footer className="bg-light py-2"></Card.Footer>
    </Card>
  );
};

ReportProgress.propTypes = {
  bodyClassName: PropTypes.string,
  value: PropTypes.number,
  label: PropTypes.string,
  title: PropTypes.string,
};

export default ReportProgress;
