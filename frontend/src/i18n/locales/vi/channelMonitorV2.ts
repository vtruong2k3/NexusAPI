/** Channel Monitor V2 (giao diện giám sát thụ động - người dùng + admin) */
export default {
  channelMonitorV2: {
    title: 'Channel Monitor',
    updating: 'Đang cập nhật dữ liệu',
    updatedTo: 'Cập nhật đến {time}',
    partialCoverage: 'Phủ lịch sử một phần',
    bootstrap: {
      title: 'Đang xây dựng dữ liệu monitor lịch sử',
      description:
        'Khi bật lần đầu, tổng hợp thụ động sẽ lấp đầy các cửa sổ 90 phút, 24 giờ, 7 ngày và 30 ngày trong nền. Tất cả khoảng thời gian sẽ đầy đủ sau khi hoàn tất.',
      progress: 'Hoàn thành {percent}%',
      working: 'Đang tổng hợp trong nền…',
    },
    timeRange: 'Khoảng thời gian',
    clearFilters: 'Đặt lại',
    refreshingFilters: 'Bộ lọc thay đổi; đang làm mới ma trận, xu hướng và chi tiết…',
    switchingData: 'Đang chuyển dữ liệu lọc…',
    summaryAria: 'Tóm tắt khoảng thời gian đã chọn',
    loadFailed: 'Tải channel monitor thất bại',
    detailLoadFailed: 'Tải chi tiết channel monitor thất bại',
    otherModels: 'Mô hình khác',
    ignored: 'Đã bỏ qua',
    currentUser: 'Người dùng hiện tại',
    ranges: { '90m': '90 phút', '24h': '24 giờ', '7d': '7 ngày', '30d': '30 ngày' },
    filters: {
      platform: 'Platform', allPlatforms: 'Tất cả', group: 'Group', allGroups: 'Tất cả', model: 'Mô hình', allModels: 'Tất cả',
      empty: 'Không có tùy chọn', selectedCount: '{count}', labelValue: '{label}: {value}'
    },
    groupBy: {
      label: 'Nhóm theo', platform: 'Platform', platformGroup: 'Platform / Group', platformModel: 'Platform / Mô hình', platformGroupModel: 'Platform / Group / Mô hình'
    },
    trendView: { label: 'Giao diện xu hướng', pulse: 'Ma trận xung', line: 'Biểu đồ đường' },
    healthMode: { label: 'Hiển thị sức khỏe', overall: 'Tổng quan', success: 'Tỷ lệ lỗi', ttft: 'Token đầu tiên', cache: 'Tỷ lệ cache' },
    tabs: { aria: 'Chiều chi tiết', models: 'Mô hình', errors: 'Lý do lỗi', users: 'Xếp hạng người dùng' },
    metrics: {
      rpm: 'RPM',
      tpm: 'TPM',
      tps: 'Tokens/giây',
      rpmDetail: 'Yêu cầu mỗi phút',
      tpmDetail: 'Tokens mỗi phút',
      tpsDetail: 'Tính từ TPM ÷ 60',
      errorRate: 'Tỷ lệ lỗi',
      ttft: 'Token đầu tiên',
      ttftP50: 'Token đầu tiên P50',
      durationP50: 'Thời lượng P50',
      cacheRate: 'Tỷ lệ cache',
      cacheDetail: 'Tỷ lệ cache đọc',
      successRate: 'Tỷ lệ thành công',
      successRateValue: 'Tỷ lệ thành công {value}',
      errorRateValue: 'Tỷ lệ lỗi {value}',
      rpmValue: 'RPM {value}',
      tpmValue: 'TPM {value}',
      tpsValue: 'Tokens/giây {value}',
      ttftValue: 'Token đầu tiên {value}',
      durationValue: 'Thời lượng {value}',
      cacheRateValue: 'Tỷ lệ cache {value}',
    },
    table: { platformModel: 'Platform / Mô hình', rank: 'Xếp hạng', user: 'Người dùng' },
    empty: { title: 'Không có dữ liệu để hiển thị', description: 'Thử thay đổi khoảng thời gian hoặc bộ lọc' },
    bucket: { minutes: 'Bucket {count} phút', hours: 'Bucket {count} giờ', days: 'Bucket {count} ngày' },
    matrix: {
      title: 'Xu hướng khả dụng', description: 'Mỗi hàng là một chiều channel và mỗi khối là khoảng tổng hợp; di chuột để xem chi tiết', wheelZoom: 'Cuộn qua các khối để phóng to (khoảng hẹp hơn, khối rộng hơn)', wheelZoomX: 'Cuộn qua các khối để phóng to (khoảng hẹp hơn, khối rộng hơn)', dimension: 'Chiều channel', emptyTitle: 'Không có dữ liệu ma trận cho cửa sổ đã chọn', legendAria: 'Chú thích điểm sức khỏe', bad: 'Xấu', good: 'Tốt', healthyLegend: 'Tốt (≥80)', warningLegend: 'Cảnh báo (50–79)', criticalLegend: 'Nguy cấp (<50)', unknownLegend: 'Không có lưu lượng / mẫu không đủ', noTraffic: 'Không có lưu lượng trong khoảng này', noTrafficAt: '{time} · không có lưu lượng', scoreLine: 'Điểm sức khỏe {score}', resetZoom: 'Đặt lại zoom'
    },
    chart: {
      title: 'Xu hướng khả dụng', description: 'Xu hướng làm mượt: tỷ lệ lỗi · token đầu tiên P50 · tỷ lệ cache', emptyTitle: 'Không có dữ liệu xu hướng cho cửa sổ đã chọn', errorLegend: 'Tỷ lệ lỗi (trục trái %)', cacheLegend: 'Tỷ lệ cache (trục trái %)', ttftLegend: 'Token đầu tiên P50 (trục phải)', errorDataset: 'Xu hướng tỷ lệ lỗi %', cacheDataset: 'Xu hướng tỷ lệ cache %', ttftDataset: 'Xu hướng token đầu tiên P50 (ms)', percentAxis: 'Tỷ lệ %', resetZoom: 'Đặt lại zoom'
    },
    errorDetail: { http: 'HTTP {code}', upstream: 'Upstream {code}', noMessage: 'Không có thông báo lỗi', empty: 'Chỉ có tỷ lệ danh mục (thông báo mẫu chỉ dành cho admin)' },
    errorCategories: {
      content_policy: 'Chính sách nội dung', authentication: 'Xác thực', context_limit: 'Giới hạn context', invalid_request: 'Yêu cầu không hợp lệ', model_unsupported: 'Mô hình không hỗ trợ', group_access: 'Quyền truy cập group', quota_or_balance: 'Quota hoặc số dư', account_pool_unavailable: 'Pool tài khoản không khả dụng', rate_or_capacity: 'Tốc độ hoặc dung lượng', timeout: 'Hết thời gian', transport_or_stream: 'Transport hoặc stream', upstream_forbidden: 'Upstream bị cấm', not_found: 'Không tìm thấy', client_cancelled: 'Client đã hủy', upstream_5xx: 'Upstream 5xx', internal: 'Nội bộ', other: 'Khác'
    },
    rank: {
      gold: 'Xếp hạng 1 vàng',
      silver: 'Xếp hạng 2 bạc',
      bronze: 'Xếp hạng 3 đồng',
      place: 'Xếp hạng {n}',
      unranked: 'Chưa xếp hạng',
    },
    settings: {
      title: 'Cấu hình V2 data monitor',
      description:
        'Cấu hình chiều tổng hợp sử dụng thụ động (platform / mô hình / group) và chu kỳ làm mới. Màu sức khỏe và chi tiết trên trang /monitor của người dùng hiển thị tỷ lệ, RPM và TPM — không phải khối lượng yêu cầu tuyệt đối.',
      save: 'Lưu',
      loading: 'Đang tải…',
      loadFailed: 'Tải cấu hình V2 thất bại',
      saveSuccess: 'Đã lưu cấu hình V2 monitor',
      saveFailed: 'Lưu cấu hình V2 thất bại',
      modeBanner:
        'Chế độ hệ thống hiện tại là {mode}. Tổng hợp phút V2 sẽ không chạy; cấu hình này có thể chuẩn bị ngay và có hiệu lực sau khi chuyển sang {modeV2}. Thay đổi chế độ trong Cài đặt hệ thống → Tùy chọn tính năng.',
      modeClosed: 'Channel monitor đã tắt',
      modeV1: 'V1 active probes',
      modeV2: 'V2 passive monitoring',
      enableTitle: 'Bật tổng hợp V2',
      enableHint:
        'Áp dụng khi chế độ hệ thống là V2. Tắt tùy chọn này chỉ dừng tổng hợp của cấu hình này; công tắc chế độ hệ thống vẫn nằm trong Tùy chọn tính năng.',
      refreshTitle: 'Khoảng tổng hợp',
      refreshHint: 'Ảnh hưởng đến độ chi tiết thời gian của ma trận và chu kỳ làm mới',
      refreshAria: 'Khoảng tổng hợp',
      platformsTitle: 'Platforms và mô hình',
      platformsHint:
        'Để trống = hiển thị tất cả tên mô hình thực; khi có nội dung, chỉ các mô hình được liệt kê mới có hàng riêng, còn lại gộp vào "Khác"',
      modelsPlaceholder: 'Trống = tất cả mô hình thực; hoặc liệt kê các mô hình phổ biến (còn lại → Khác)',
      badgeAllModels: 'Tất cả mô hình',
      badgeOther: '+ Khác',
      groupsTitle: 'Groups được giám sát',
      groupsSelected: 'Đã chọn {count} group',
      groupsAll: 'Tất cả group',
      groupsEmpty: 'Không có group nào',
      errorsTitle: 'Danh mục lỗi và bỏ qua',
      errorsHint:
        'Các danh mục được đánh dấu "bỏ qua" bị loại khỏi tỷ lệ lỗi và điểm sức khỏe, nhưng vẫn hiển thị màu xám trong phân tích lỗi. Lỗi không khớp gộp vào "Khác".',
      ignoredSummary: 'Đã bỏ qua {ignored} danh mục · tính vào tỷ lệ lỗi {counted} danh mục',
      healthTitle: 'Ngưỡng sức khỏe',
      healthHint:
        'Kiểm soát các dải màu hiển thị cho người dùng và điểm tổng quan. Mặc định khoan dung để tỷ lệ lỗi nhỏ hoặc cache thấp không hiển thị ngay là không lành mạnh.',
      fields: {
        minimumSample: 'Mẫu tối thiểu',
        warningError: 'Tỷ lệ lỗi cảnh báo %',
        criticalError: 'Tỷ lệ lỗi nguy cấp %',
        targetTtft: 'TTFT mục tiêu ms',
        warningTtft: 'TTFT cảnh báo ms',
        criticalTtft: 'TTFT nguy cấp ms',
        warningCache: 'Tỷ lệ cache cảnh báo %',
        criticalCache: 'Tỷ lệ cache nguy cấp %',
      },
      namedModelsEmpty: 'Danh sách mô hình của platform trống: mọi tên mô hình thực sẽ được hiển thị (không gộp vào "Khác").',
      namedModelsCount: 'Hiển thị {count} chiều mô hình đặt tên; mô hình không liệt kê gộp vào "Khác" theo platform.',
      userContractTitle: 'Hợp đồng hiển thị cho người dùng',
      userContract: {
        health: 'Trọng số màu sức khỏe: tỷ lệ lỗi 60% + token đầu tiên P50 20% + tỷ lệ cache 20% (ngưỡng có thể cấu hình ở trên)',
        trend: 'Xu hướng có thể chuyển giữa ma trận xung và biểu đồ đường (lỗi · cache · token đầu tiên)',
        latency: 'Độ trễ hiển thị AVG · P50 · P90; số yêu cầu / lỗi tuyệt đối không hiển thị',
        models: 'Danh sách mô hình trống hiển thị tên thực và không bao giờ gộp tất cả vào "Khác"',
      },
    },
    admin: {
      descriptionV1:
        'Chế độ hệ thống là V1 active probes: quản lý probe monitors và chạy kiểm tra ngay; tổng hợp V2 không chạy.',
      descriptionV2:
        'Chế độ hệ thống là V2 passive monitoring: cấu hình chiều tổng hợp; V1 active probes không chạy.',
      tabAria: 'Quản lý monitor',
      tabV2: 'Cấu hình V2 data monitor',
      tabV1Active: 'V1 active probes',
      tabV1History: 'Lịch sử V1 (probes không hoạt động trong chế độ hiện tại)',
    },
  },
}
